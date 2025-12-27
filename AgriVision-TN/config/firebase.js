import { initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGTKFUuuryhKqut3zPr9cKcimcpwCF9NA",
  authDomain: "agri-vision-4dd1e.firebaseapp.com",
  projectId: "agri-vision-4dd1e",
  storageBucket: "agri-vision-4dd1e.firebasestorage.app",
  messagingSenderId: "40686896414",
  appId: "1:40686896414:web:e329ce6ea0fbb03676b50f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
