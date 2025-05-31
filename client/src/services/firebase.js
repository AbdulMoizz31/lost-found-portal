import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';


const firbaseConfig = {

    apiKey: "AIzaSyBqbLCkC9by6MYIHFz0diFlrWKoTInkgsA",
    authDomain: "lost-found-portal-b6cd8.firebaseapp.com",
    projectId: "lost-found-portal-b6cd8",
    storageBucket: "lost-found-portal-b6cd8.firebasestorage.app",
    messagingSenderId: "285409392482",
    appId: "1:285409392482:web:71b3ddb26155dbc1929e3b",
    measurementId: "G-2FVWY5PTGZ"
}

const app = initializeApp(firbaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;



import { toast } from "react-toastify";

export const logoutUser = (navigate) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/login");
    })
    .catch((error) => {
      console.error("Logout Error:", error.message);
      toast.error("Logout failed. Try again.");
    });
};
