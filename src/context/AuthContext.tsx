import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from "react";
import { useRouter } from "@/routes/hooks";

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  setToken: (token: string | null, user?: { username: string; role: string }) => void;
  setUsername: (username: string | null) => void;
  setRole: (role: string | null) => void;
  isAuthenticated: () => boolean | null;
  logout: () => void; // Renomeado aqui
}

interface DecodedToken {
  exp: number;
  username?: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [role, setRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setToken = useCallback((newToken: string | null) => {
    if (newToken) {
      try {
        const decoded: DecodedToken = jwtDecode(newToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp <= currentTime || decoded.role !== "Admin") {
          throw new Error("Token expirado ou sem permissão");
        }

        setTokenState(newToken);
        setUsernameState(decoded.username ?? null);
        setRoleState(decoded.role ?? null);
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("authUsername", decoded.username ?? "");
        localStorage.setItem("authRole", decoded.role ?? "");
      } catch (error) {
        console.error("Token inválido ou sem permissão:", error);
        setTokenState(null);
        setUsernameState(null);
        setRoleState(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUsername");
        localStorage.removeItem("authRole");
        router.push("/");
      }
    } else {
      setTokenState(null);
      setUsernameState(null);
      setRoleState(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUsername");
      localStorage.removeItem("authRole");
    }
  }, [router]);

  const setUsername = useCallback((newUsername: string | null) => {
    setUsernameState(newUsername);
    if (newUsername) {
      localStorage.setItem("authUsername", newUsername);
    } else {
      localStorage.removeItem("authUsername");
    }
  }, []);

  const setRole = useCallback((newRole: string | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("authRole", newRole);
    } else {
      localStorage.removeItem("authRole");
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");

    if (savedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(savedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp <= currentTime || decoded.role !== "Admin") {
          throw new Error("Token expirado ou sem permissão");
        }

        setTokenState(savedToken);
        setUsernameState(decoded.username ?? null);
        setRoleState(decoded.role ?? null);

        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          setToken(null);
          setUsername(null);
          setRole(null);
          router.push("/");
        }, timeout);

        setIsLoading(false);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Token inválido ao carregar:", error);
        setToken(null);
        setUsername(null);
        setRole(null);
        router.push("/");
      }
    } else {
      setIsLoading(false);
    }

    return undefined;
  }, [setToken, setUsername, setRole, router]);

  const isAuthenticated = useCallback(() => {
    if (isLoading) return null;
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime && decoded.role === "Admin";
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [token, isLoading]);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    setRole(null);
    router.push("/");
  }, [setToken, setUsername, setRole, router]);

  const memorizedValue = useMemo(
    () => ({ token, username, role, setToken, setUsername, setRole, isAuthenticated, logout }),
    [token, username, role, setToken, setUsername, setRole, isAuthenticated, logout]
  );

  return (
    <AuthContext.Provider value={memorizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
