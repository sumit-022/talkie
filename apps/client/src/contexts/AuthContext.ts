import { createContext } from "react";
import { AuthState } from "@/types/auth";

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
