// toggle side bar
const sideBarBtn = document.getElementById("side-bar-btn");
const sideBar = document.getElementById("side-bar");
let startX = 0; // variable to store the initial touch position
sideBarBtn.addEventListener("click", function () {
  sideBar.classList.remove("hidden");
  console.log("hekkoo");
});

// add touch event listeners to the side bar
sideBar.addEventListener("touchstart", function (event) {
  startX = event.touches[0].clientX; // store the initial touch position
});
sideBar.addEventListener("touchmove", function (event) {
  const currentX = event.touches[0].clientX; // get the current touch position
  console.log(currentX, startX);

  const diffX = currentX - startX; // calculate the difference between the current and initial touch positions

  if (diffX > 50) {
    sideBar.classList.remove("hidden"); // show the side bar if the user swipes right
  } else if (diffX < -50) {
    sideBar.classList.add("hidden"); // hide the side bar if the user swipes left
  }
});
sideBar.addEventListener("touchend", function (event) {
  const endX = event.changedTouches[0].clientX; // get the final touch position
  const diffX = endX - startX; // calculate the difference between the current and initial touch positions

  if (diffX > 50) {
    sideBar.classList.remove("hidden"); // show the side bar if the user swipes right
  } else if (diffX < -50) {
    sideBar.classList.add("hidden"); // hide the side bar if the user swipes left
  }
});

// remove aside
let removeAside = document.getElementById("remove-aside");
removeAside.addEventListener("click", function () {
  sideBar.classList.add("hidden");
});

// touch screen to remove side bar
document.addEventListener("click", function (event) {
  if (!sideBar.contains(event.target) && !sideBarBtn.contains(event.target)) {
    sideBar.classList.add("hidden"); // hide the side bar if the user clicks outside of it
  }
});

// display all todos
const todoListApp = document.getElementById("todo-list-app");
let todoList;

// fetch data
const fetchData = () => {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((res) => res.json())
    .then((data) => {
      todoList = data;
      retrieve(todoList);
    });
};
fetchData();

function checkTask(id) {
  todoList.map((todo) => {
    if (todo.id === id) {
      updateList(todo);
    }
  });
}

function updateList(todo) {
  fetch(`http://localhost:2000/todos/${todo.id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
    }),
  });
}

// function to get data
const retrieve = (datas) => {
  datas.map((data) => {
    todoListApp.innerHTML += `
        <div class="bg-[#fff] p-4 rounded-xl shadow-lg w-full h-1/6 mb-4 relative flex justify-between items-center">
          ${
            !data.completed
              ? `<span onclick="checkTask(${data.id})" id="check" class="w-[6%] h-5 border-2 border-gray-400 rounded-md cursor-pointer"></span>`
              : `<span><i class="fa-solid fa-check border-2 rounded border-neutral-600 text-xs p-1"></i></span>`
          }
          <div class="w-[88%]">
            <h3 class="font-semibold text-sm">${data.title}</h3>
            <p class="text-neutral-500 text-xs">Lorem ipsum dolor sit amet.</p>
            <span class="text-neutral-400 text-xs">may 2</span>
          </div>
          </div>
        `;
    // check todo
    const check = document.querySelectorAll("#check");
    check.forEach((item) => {
      item.addEventListener("click", function (e) {
        data.completed = !data.completed;
      });
    });
  });
};

// add a new list
function createNote(title, content, completed) {
  //note constructor
  this.title = title;
  this.content = content;
  this.completed = completed;
}

// show note modal
let modalBackdrop = document.getElementById("modal-backdrop");
let noteModal = document.getElementById("note-modal");
let addNote = document.getElementById("add-note");

addNote.addEventListener("click", function () {
  modalBackdrop.classList.remove("hidden");
  noteModal.classList.remove("hidden");
});

// close note modal
modalBackdrop.addEventListener("click", function (event) {
  if (!noteModal.contains(event.target) && !addNote.contains(event.target)) {
    noteModal.classList.add("hidden");
    modalBackdrop.classList.add("hidden");
  }
});

// add a new list to the list
let create = document.getElementById("create-note");
let noteTitle = document.getElementById("note-title");
let textArea = document.getElementById("text-area");
create.addEventListener("click", function () {
  if (noteTitle.value !== "" || textArea.value !== "") {
    createNote(noteTitle.value, textArea.value, false);
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: noteTitle.value,
        content: textArea.value,
        completed: false,
      }),
    })
      .then((res) => res.json())

      .then((data) => console.log("POST: ", data));
  }
  noteTitle.value = "";
  textArea.value = ""; // clear the input fields
  modalBackdrop.classList.add("hidden");
  noteModal.classList.add("hidden"); // hide the modal
});
