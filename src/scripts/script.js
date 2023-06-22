const URL = "http://localhost:3000/todos";
let selectedTodoID = null;

function deleteTodo(id) {
  $.ajax({
    url: `${URL}/${id}`,
    type: "delete",
    success: function (res) {
      console.log(res);
    },
  });
}

function handleEditTodo(id) {
  selectedTodoID = id;
  const taskName = $("#task");
  const cat = $("#cat");
  const date = $("#date");
  const description = $("#description");
  const submitBtn = $("#submit");
  $.ajax({
    url: `${URL}/${id}`,
    success: function (todo) {
      taskName.val(todo.task);
      cat.val(todo.cat);
      date.val(todo.date);
      submitBtn.text("Edit Todo");
      description.val(todo.desc);
    },
  });
}

$(function () {
  const description = $("#description");
  const submitBtn = $("#submit");
  function generateTodo(todo) {
    $(
      "#list"
    ).append(` <li class="bg-green-300 p-2 flex justify-between items-center text-gray-700">
            <div>
                <p>${todo.task}</p>
                <small>${todo.cat}</small>
                <small>${todo.date}</small>
                <small>${todo.desc}</small>
            </div>
              <div class="actions">
                <button class="text-blue-600" onclick=handleEditTodo(${todo.id})>
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="text-red-600" onclick=deleteTodo(${todo.id})>
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </li>`);
  }

  function getAlltodos() {
    $.ajax({
      url: URL,
      success: function (res) {
        res.forEach((todo) => {
          generateTodo(todo);
        });
      },
    });
  }

  getAlltodos();

  description.on("input", function () {
    const textCount = $("#text-count");
    const charactersLeft = 100 - $(this).val().length;
    const spanText = `${charactersLeft} characters left`;
    textCount.text(spanText);
    if (charactersLeft <= 0) {
      textCount.removeClass("text-green-600");
      textCount.addClass("text-red-600");
      $(this).addClass("border-2 border-rose-500 focus:border-2");
    } else {
      textCount.addClass("text-green-600");
      textCount.removeClass("text-red-600");
      $(this).removeClass("border-2 border-rose-500 focus:border-2");
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (e.target.innerText == "Add Todo") {
      addTodo();
    }
    if (e.target.innerText == "Edit Todo") {
      editTodo();
    }
  }

  function editTodo() {
    const taskName = $("#task");
    const cat = $("#cat");
    const date = $("#date");
    const description = $("#description");
    const editedTodo = {
      id: selectedTodoID,
      task: taskName.val(),
      cat: cat.val(),
      date: date.val(),
      desc: description.val(),
    };
    $.ajax({
      url: `${URL}/${selectedTodoID}`,
      type: "put",
      data: editedTodo,
    });
  }

  function addTodo() {
    const taskName = $("#task");
    const cat = $("#cat");
    const date = $("#date");
    const description = $("#description");
    const newTodo = {
      task: taskName.val(),
      cat: cat.val(),
      date: date.val(),
      desc: description.val(),
    };
    $.ajax({
      url: `${URL}`,
      type: "post",
      data: newTodo,
    });
  }
  submitBtn.on("click", handleSubmit);
});
