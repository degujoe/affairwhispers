// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle registration
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    document.getElementById('auth-message').textContent = `Registration successful! Welcome, ${user.email}`;
  } catch (error) {
    document.getElementById('auth-message').textContent = `Error: ${error.message}`;
  }
});

// Handle login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    document.getElementById('auth-message').textContent = `Login successful! Welcome back, ${user.email}`;
    localStorage.setItem('isMember', 'true'); // Mark user as a member for other parts of your app
  } catch (error) {
    document.getElementById('auth-message').textContent = `Error: ${error.message}`;
  }
});
