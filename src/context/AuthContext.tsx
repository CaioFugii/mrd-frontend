import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        console.log(decoded);

        if (isExpired) {
          logout();
        } else {
          setRole(decoded.role);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Token inválido");
        logout();
      }
    }
  }, [token]);

  const isAuthenticated = !!token;

  function login(token: string) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
