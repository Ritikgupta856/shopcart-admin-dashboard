import { createContext, useState, useEffect } from "react";
import api from "@/lib/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/api/login", { email, password });
    const { token, user: loggedInUser } = response.data;

    if (loggedInUser.role !== "admin") {
      throw new Error("You do not have admin access");
    }

    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
