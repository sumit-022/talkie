import { useState, useEffect } from "react";
import AuthService from "@/services/auth";
import AuthContext from "@/contexts/AuthContext";
import { AxiosError } from "axios";
import { IUser } from "@/types/auth";

export interface AuthState {
  user: IUser | null;
  error: AxiosError | Error | null;
  loading: boolean;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>({
    user: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState({ user: null, error: null, loading: false });
      return;
    }
    AuthService.getUser()
      .then((user) => {
        setState({ user, error: null, loading: false });
      })
      .catch((error) => {
        setState({ user: null, error, loading: false });
      });
  }, []);

  const login = (email: string, password: string) => {
    AuthService.login(email, password)
      .then(({ user }) => {
        setState({ user, error: null, loading: false });
      })
      .catch((error) => {
        setState({ user: null, error, loading: false });
      });
  };

  const logout = () => {
    AuthService.logout();
    setState({ user: null, error: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
