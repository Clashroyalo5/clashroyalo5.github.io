import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7oiEkBVOgJyRGZQsJB-fOD5ChuLrrIJU",
  authDomain: "mas-calzado-leon.firebaseapp.com",
  projectId: "mas-calzado-leon",
  storageBucket: "mas-calzado-leon.firebasestorage.app",
  messagingSenderId: "482606547232",
  appId: "1:482606547232:web:beb424247b5121d8d9d745"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const PLAYLIST_DOC_ID = "main_playlist"; // Documento donde se guardará el orden

export async function getFirebaseOrder() {
    try {
        const docRef = doc(db, "playlists", PLAYLIST_DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().order;
        }
        return null;
    } catch (e) {
        console.error("Error leyendo Firebase. Usando orden local.", e);
        return null;
    }
}

export async function saveFirebaseOrder(orderArray) {
    try {
        const docRef = doc(db, "playlists", PLAYLIST_DOC_ID);
        await setDoc(docRef, { order: orderArray }, { merge: true });
        console.log("Orden guardado en Firebase.");
    } catch (e) {
        console.error("Error guardando en Firebase:", e);
    }
}