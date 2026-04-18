import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3UDukRhczqb0wwvTxymmd8YHYWda_stY",
  authDomain: "prompt-war-2662c.firebaseapp.com",
  projectId: "prompt-war-2662c",
  storageBucket: "prompt-war-2662c.firebasestorage.app",
  messagingSenderId: "636739225397",
  appId: "1:636739225397:web:0cb7d9a4eeecf927002e7c",
  measurementId: "G-TMH5W5NLZ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
