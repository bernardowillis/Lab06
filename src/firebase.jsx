import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "por motivos de seguridad no puedo subir esto a github",
  authDomain: "por motivos de seguridad no puedo subir esto a github",
  projectId: "por motivos de seguridad no puedo subir esto a github",
  storageBucket: "por motivos de seguridad no puedo subir esto a github",
  messagingSenderId: "por motivos de seguridad no puedo subir esto a github",
  appId: "por motivos de seguridad no puedo subir esto a github"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
