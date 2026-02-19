import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZZvMGZK7MJ2jGfikEI0txONpQjBt5OC8",
  authDomain: "planer-255ff.firebaseapp.com",
  projectId: "planer-255ff",
  storageBucket: "planer-255ff.firebasestorage.app",
  messagingSenderId: "973076729501",
  appId: "1:973076729501:web:d5509f335eaee015b2ce74",
  measurementId: "G-P8GNE646MM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const homeworkCollection = collection(db, "homeworks");

/* ===== СИНХРОНИЗАЦИЯ ===== */
onSnapshot(homeworkCollection, (snapshot) => {
  state.homeworks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  renderHomeworks();
  renderCalendar();
});

/* ===== ДОБАВИТЬ ===== */
window.addHomeworkToDB = async (data) => {
  await addDoc(homeworkCollection, data);
};

/* ===== УДАЛИТЬ ===== */
window.deleteHomeworkFromDB = async (id) => {
  await deleteDoc(doc(db, "homeworks", id));
};

/* ===== ОБНОВИТЬ ===== */
window.updateHomeworkInDB = async (id, data) => {
  await updateDoc(doc(db, "homeworks", id), data);
};
