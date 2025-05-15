import { createContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsTestUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loginAsTestUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setCurrentUser({
        uid: "dev-user",
        email: "dev@local.test",
      } as User);
      return;
    }
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);

  const login = async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      setCurrentUser({
        uid: "dev-user",
        email: "dev@local.test",
      } as User);
      return;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      setCurrentUser({
        uid: "dev-user",
        email: "dev@local.test",
      } as User);
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (import.meta.env.DEV || currentUser?.uid === "test-user") {
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
  };

  const loginAsTestUser = () => {
    setCurrentUser({
      uid: "test-user",
      email: "test@guest.local",
    } as User);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, loginAsTestUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
