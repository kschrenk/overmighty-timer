import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

export interface SignupArguments {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (signupArgs: SignupArguments) => Promise<void>;
  logout: () => Promise<void>;
  loginAsTestUser: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loginAsTestUser: () => {},
  sendPasswordResetEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);
