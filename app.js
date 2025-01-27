
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFR-s7dApTZjkPaf8yGKs093j0ypZiKm8",
  authDomain: "chatapps-5f834.firebaseapp.com",
  databaseURL: "https://chatapps-5f834-default-rtdb.firebaseio.com",
  projectId: "chatapps-5f834",
  storageBucket: "chatapps-5f834.firebasestorage.app",
  messagingSenderId: "148842410928",
  appId: "1:148842410928:web:29a42a5e3b5c2b9e3adc75",
  measurementId: "G-EHN176WBQF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const messagesRef = ref(db, "messages");

const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
const messagesDiv = document.getElementById("messages");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    push(messagesRef, { text: message, timestamp: Date.now() });
    messageInput.value = "";
  }
});

// Listen for new messages
onValue(messagesRef, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val().text;
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
  });
});
