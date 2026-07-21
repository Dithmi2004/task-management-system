/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useContext,
  useState
} from "react";
import api from "../api/axiosInstance";
import type {
  LoginCredentials,
  LoginResponse,
  User
} from "../types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredUser(): User | null {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading] = useState(false);

  async function login(
    credentials: LoginCredentials
  ): Promise<void> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    const { token, user: loggedInUser } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  }

  function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
