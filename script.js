const apiUrl = window.APP_CONFIG.API_URL;
console.log(apiUrl);

// toggle side bar
const sideBarBtn = document.getElementById("side-bar-btn");
const sideBar = document.getElementById("side-bar");
let startX = 0; // variable to store the initial touch position
sideBarBtn.addEventListener("click", function () {
  sideBar.classList.remove("hidden");
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
let completedTodos;

// fetch data
const fetchData = () => {
  fetch(`${apiUrl}/data/todoList.json`)
    .then((res) => res.json())
    .then((data) => {
      todoList = data;
      retrieve(todoList);
    });
};
fetchData();

// complete a task
todoListApp.addEventListener("click", function (e) {
  if (e.target.classList.contains("check-list")) {
    const li = e.target.closest("div");
    todoList.map((todo) => {
      if (li.dataset.id == todo.id) {
        updateList(todo);
      }
    });
  } else if (e.target.classList.contains("del-list")) {
    const li = e.target.closest("div");
    todoList.map((todo) => {
      if (li.dataset.id == todo.id) {
        deleteTodo(todo);
      }
    });
  }
});

function updateList(todo) {
  fetch(`${apiUrl}/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: todo.userId,
      id: todo.id,
      title: todo.title,
      completed: !todo.completed,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      retrieve(data);
    });
}

// function to get data
const date = new Date();
let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const retrieve = (datas) => {
  datas.map((data) => {
    todoListApp.innerHTML += `
        <div data-id="${
          data.id
        }" class="bg-[#fff] p-4 rounded-xl shadow-lg w-full h-1/6 mb-4 relative flex gap-14 justify-between items-center">
          ${
            !data.completed
              ? `<span id="check" class="w-[10%] h-5 border-2 border-gray-400 rounded-md cursor-pointer check-list"></span>`
              : `<span><i class="fa-solid fa-check border-2 rounded border-neutral-600 text-xs p-1 check-list"></i></span>`
          }
          <div class="w-[88%]">
          ${
            data.completed
              ? `<del><h3 class="font-semibold text-sm">${data.title}</h3>
            <p class="text-neutral-500 text-xs">Lorem ipsum dolor sit amet.</p>
            <span class="text-neutral-400 text-xs">may 2</span></del>`
              : `<h3 class="font-semibold text-sm">${data.title}</h3>
            <p class="text-neutral-500 text-xs">${data.content}</p>
            <span class="text-neutral-400 text-xs">${
              monthNames[date.getMonth()]
            }, ${date.getDate()}</span>`
          }
          </div>
          <span class="cursor-pointer"><i class="fa-solid fa-trash del-list"></i></span>
          </div>
        `;
  });
};

// delete request
function deleteTodo(todo) {
  fetch(`${apiUrl}/todos/${todo.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: todo.userId,
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      retrieve(data);
    });
}

// filter todos
let allTask = document.getElementById("all-task");
let completed = document.getElementById("completed");
let incomplete = document.getElementById("incomplete");
window.onload = function () {
  allTask.classList.add("bg-white", "rounded-2xl", "px-2", "py-5");
};
completed.addEventListener("click", function () {
  allTask.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  completed.classList.add("bg-white", "rounded-2xl", "px-2", "py-5");
  incomplete.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  sideBar.classList.add("hidden"); // hide the side bar
  todoListApp.innerHTML = ""; // clear the todo list
  todoList.map((todo) => {
    if (todo.completed) {
      retrieve([todo]);
    }
  });
});
incomplete.addEventListener("click", function () {
  allTask.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  completed.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  incomplete.classList.add("bg-white", "rounded-2xl", "px-2", "py-5");
  sideBar.classList.add("hidden"); // hide the side bar
  todoListApp.innerHTML = ""; // clear the todo list
  todoList.map((todo) => {
    if (!todo.completed) {
      retrieve([todo]);
    }
  });
});
allTask.addEventListener("click", function () {
  allTask.classList.add("bg-white", "rounded-2xl", "px-2", "py-5");
  completed.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  incomplete.classList.remove("bg-white", "rounded-2xl", "px-2", "py-5");
  sideBar.classList.add("hidden"); // hide the side bar
  todoListApp.innerHTML = ""; // clear the todo list
  todoList.map((todo) => {
    retrieve([todo]);
  });
});

// filter todos using search bar
let search = document.getElementById("search");
search.addEventListener("keyup", function () {
  let searchValue = search.value.toLowerCase(); // get the value of the search bar
  todoListApp.innerHTML = ""; // clear the todo list
  todoList.map((todo) => {
    if (todo.title.toLowerCase().includes(searchValue)) {
      retrieve([todo]); // display the todos that match the search value
    }
  });
});

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
let timeCreated = document.querySelector(".timeCreated");
timeCreated.textContent = `${date.getDate()} ${
  monthNames[date.getMonth()]
} ${date.getHours()}:${date.getMinutes()} `; // get the current date
create.addEventListener("click", function () {
  if (noteTitle.value !== "" || textArea.value !== "") {
    createNote(noteTitle.value, textArea.value, false);
    fetch(`${apiUrl}/todos`, {
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

      .then((data) => {
        fetchData();
        console.log("POST: ", data);
      });
  }
  noteTitle.value = "";
  textArea.value = ""; // clear the input fields
  modalBackdrop.classList.add("hidden");
  noteModal.classList.add("hidden"); // hide the modal
});
