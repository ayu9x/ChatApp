// Import Firebase functions
import {
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Get Firebase instances from window object
const db = window.db;
const auth = window.auth;
const provider = new GoogleAuthProvider();

// References
const messagesRef = ref(db, "messages");

// DOM Elements
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
const messagesDiv = document.getElementById("messages");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

// Login with Google
loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert(`Welcome, ${user.displayName}!`);
        })
        .catch((error) => {
            console.error("Login failed:", error);
        });
});

// Logout
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Logged out!");
        })
        .catch((error) => {
            console.error("Logout failed:", error);
        });
});

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        userInfo.textContent = `Logged in as: ${user.email}`;
    } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        userInfo.textContent = "";
    }
});

// Add a new message to the database
messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert("You must log in to send a message!");
        return;
    }
    const message = messageInput.value.trim();
    if (message) {
        push(messagesRef, {
            text: message,
            timestamp: Date.now(),
            user: user.email
        });
        messageInput.value = "";
    }
});

// Listen for new messages
onValue(messagesRef, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        const messageKey = childSnapshot.key;

        // Create message element
        const messageElement = document.createElement("div");
        messageElement.style.display = "flex";
        messageElement.style.justifyContent = "space-between";
        messageElement.style.marginBottom = "10px";
        messageElement.style.padding = "5px";
        messageElement.style.backgroundColor = "#f8f9fa";
        messageElement.style.borderRadius = "5px";

        // Add message text
        const textElement = document.createElement("p");
        textElement.textContent = `${message.user || "Anonymous"}: ${message.text}`;
        textElement.style.margin = "0";
        messageElement.appendChild(textElement);

        // Add delete button (only for the message owner)
        if (auth.currentUser && auth.currentUser.email === message.user) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.style.padding = "2px 8px";
            deleteBtn.style.backgroundColor = "#dc3545";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.borderRadius = "3px";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.onclick = () => {
                remove(ref(db, `messages/${messageKey}`));
            };
            messageElement.appendChild(deleteBtn);
        }

        messagesDiv.appendChild(messageElement);
    });
    
    // Scroll to bottom after adding new messages
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
