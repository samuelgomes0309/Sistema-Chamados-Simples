// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCnGT-vuOVX32eX4iNly3s-Wr7cgxu2L7A",
	authDomain: "chamados-sg.firebaseapp.com",
	projectId: "chamados-sg",
	storageBucket: "chamados-sg.firebasestorage.app",
	messagingSenderId: "129892114067",
	appId: "1:129892114067:web:d8d32db0cfe0dbf3d73766",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
