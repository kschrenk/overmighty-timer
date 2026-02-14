import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/firebase";
import { isUidTestUser, TEST_USER } from "@/lib/testUser";
import type { SignupArguments } from "@/context/AuthContext/useAuth";
import { AuthContext } from "@/context/AuthContext/useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async ({ name, email, password }: SignupArguments) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw new Error("Email already in use.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
        setCurrentUser(userCredential.user);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error; // Re-throw the error to be caught by the component
    }
  };

  const logout = async () => {
    if (import.meta.env.DEV || isUidTestUser(currentUser?.uid)) {
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
  };

  const loginAsTestUser = () => {
    setCurrentUser({
      uid: TEST_USER,
      email: "test@guest.local",
    } as User);
  };

  const sendPasswordResetEmail = async (email: string) => {
    await fbSendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        loginAsTestUser,
        sendPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
