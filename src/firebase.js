import firebase from  'firebase/compat/app'
import 'firebase/compat/auth'
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIIREBASE_APP_ID
})

export const storage = getStorage(app)
export const realtimeDb = getDatabase(app)
export const firestoreDb = getFirestore(app)
export const auth = app.auth()

export default app

// dssds