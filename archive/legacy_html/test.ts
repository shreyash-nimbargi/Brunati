<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBDXdhF8Iz0XfvSIg77tnPRKpb2xkVgVGM",
    authDomain: "brunati-store.firebaseapp.com",
    projectId: "brunati-store",
    storageBucket: "brunati-store.firebasestorage.app",
    messagingSenderId: "103439651942",
    appId: "1:103439651942:web:7de94ee55aabd1f3e949a7",
    measurementId: "G-P21378KSTE"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>