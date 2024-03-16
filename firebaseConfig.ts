import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyACXyPF9_4zRdD77VcyvjTPqvVsefdd0VE",
    authDomain: "paymasterguardians.firebaseapp.com",
    projectId: "paymasterguardians",
    storageBucket: "paymasterguardians.appspot.com",
    messagingSenderId: "875477207269",
    appId: "1:875477207269:web:88a4aca545822c01f3ac0c",
    measurementId: "G-MWPYM9CEV4"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
