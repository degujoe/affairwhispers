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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Function to check if a user is logged in
function checkLoggedInUser() {
  return new Promise((resolve) => {
    const user = firebase.auth().currentUser;
    resolve(user);
  });
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user);
    localStorage.setItem("loggedInUser", JSON.stringify(user)); // Save user info
  } else {
    console.log("No user is logged in.");
    localStorage.removeItem("loggedInUser"); // Clear user info
  }
});

// Function to log in a user
function logInUser(email, password) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      throw error;
    });
}

// Function to log out the user
function logOutUser() {
  return firebase.auth().signOut().then(() => {
    console.log("User logged out.");
  });
}
