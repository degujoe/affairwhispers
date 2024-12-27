// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

    document.getElementById("auth-message").textContent = `Registration successful! Welcome, ${user.email}`;
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

    // Retrieve subscription status from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      localStorage.setItem("isMember", userData.subscriptionStatus === "active" ? "true" : "false");

      document.getElementById("auth-message").textContent = `Login successful! Welcome back, ${user.email}`;
    } else {
      document.getElementById("auth-message").textContent = `User data not found. Please contact support.`;
    }
  } catch (error) {
    document.getElementById("auth-message").textContent = `Error: ${error.message}`;
  }
});
