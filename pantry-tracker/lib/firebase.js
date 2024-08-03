import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, child } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyCX92c5vRgFC4XVCTYPgvzMB1uhnpJumGc",
  authDomain: "pantry-tracker-4d365.firebaseapp.com",
  projectId: "pantry-tracker-4d365",
  storageBucket: "pantry-tracker-4d365.appspot.com",
  messagingSenderId: "678727779265",
  appId: "1:678727779265:web:1ab1b28bf4df4b5e4ea540",
  measurementId: "G-46LYJJW0HC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, update, remove, child };
