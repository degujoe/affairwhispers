<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDYpVTWymrrEbtJ1ji1RW1L-VNqQQ33wDM",
    authDomain: "affairwhispers.firebaseapp.com",
    projectId: "affairwhispers",
    storageBucket: "affairwhispers.firebasestorage.app",
    messagingSenderId: "786032191098",
    appId: "1:786032191098:web:f61cc44ad67d5fbde8bdc3",
    measurementId: "G-7VRSFQCQ9Y"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
