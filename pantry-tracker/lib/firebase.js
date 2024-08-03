import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, child } from "firebase/database";


const firebaseConfig = {
  apiKey: "**************",
  authDomain: "**************",
  projectId: "**************",
  storageBucket: "**************",
  messagingSenderId: "**************",
  appId: "**************",
  measurementId: "**************"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, update, remove, child };
