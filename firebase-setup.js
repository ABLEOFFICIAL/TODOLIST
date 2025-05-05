import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3VGCUZEI8SWGguKed1g1Vv9iVznTCEB8",
  authDomain: "todolist-api-1d8fd.firebaseapp.com",
  projectId: "todolist-api-1d8fd",
  storageBucket: "todolist-api-1d8fd.firebasestorage.app",
  messagingSenderId: "335848245389",
  appId: "1:335848245389:web:e789a34b60783cfa80bac4",
  measurementId: "G-M948QXZ0MC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expose to global scope
window.db = db;
window.addTodo = async function (title) {
  if (title.trim() !== "") {
    await addDoc(collection(db, "todos"), { title });
  }
};
window.getTodos = async function () {
  const querySnapshot = await getDocs(collection(db, "todos"));
  const todos = [];
  querySnapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() });
  });
  return todos;
};
