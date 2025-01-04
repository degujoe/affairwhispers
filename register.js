// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYpVTWymrrEbtJ1ji1RW1L-VNqQQ33wDM",
  authDomain: "affairwhispers.firebaseapp.com",
  projectId: "affairwhispers",
  storageBucket: "affairwhispers.firebasestorage.app",
  messagingSenderId: "786032191098",
  appId: "1:786032191098:web:f61cc44ad67d5fbde8bdc3",
  measurementId: "G-7VRSFQCQ9Y",
};

document.addEventListener('DOMContentLoaded', () => {
  const backToProfilesLink = document.getElementById('back-to-profiles');

  // Check if the user is logged in
  const isLoggedIn = localStorage.getItem('loggedInUser'); // Adjust based on your authentication system

  if (isLoggedIn) {
    backToProfilesLink.style.display = 'block'; // Show the button if logged in
  } else {
    backToProfilesLink.style.display = 'none'; // Hide the button if not logged in
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Handle registration
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      subscriptionStatus: "inactive", // Default status
      createdAt: new Date().toISOString(), // Timestamp
    });

    document.getElementById("auth-message").textContent = `Registration successful! Please now log in, ${user.email}`;
  } catch (error) {
    document.getElementById("auth-message").textContent = `Error: ${error.message}`;
  }
});

// Handle login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store the logged-in user's email in localStorage
    localStorage.setItem("loggedInUser", JSON.stringify({ uid: user.uid, email: user.email }));

    document.getElementById("auth-message").textContent = `Login successful! Welcome back ${user.email}, please refresh the page to access the "Back to Profiles" button.`;
  } catch (error) {
    document.getElementById("auth-message").textContent = `Error: ${error.message}`;
  }
});

