import { env } from "./env";


export const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: "digital-cookbook-b51fb.firebaseapp.com",
    projectId: "digital-cookbook-b51fb",
    storageBucket: "digital-cookbook-b51fb.appspot.com",
    messagingSenderId: "1083710931621",
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: "G-XNDCMY1EER",
};