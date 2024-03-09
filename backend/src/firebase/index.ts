import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
  }),
});

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
