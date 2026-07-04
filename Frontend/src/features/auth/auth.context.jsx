import { useState, createContext, useEffect } from "react";
import { getProfile } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);


  return (
    <AuthContext.Provider value={{ user, setUser, Loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
