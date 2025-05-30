import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { AuthContext } from "./AuthContextDef";

export const AuthProvider = ({
  children,
  allowedDomain = "umt.edu.pk", 
}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !currentUser.email.endsWith(`@${allowedDomain}`)) {
        setError(`Only @${allowedDomain} emails are allowed.`);
        signOut(auth);
        setUser(null);
      } else {
        setUser(currentUser);
        setError("");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [allowedDomain]);

  const signInWithGoogle = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, error, loading, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
