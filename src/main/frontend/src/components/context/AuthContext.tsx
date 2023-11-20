import React, { createContext, ReactNode, useContext, useState } from 'react';
import IUser from '../../types/UserType';
import { authService } from "../../services/AuthService";

interface AuthContextType {
  user: IUser | null;
  login: ( username: string, password: string ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialUser = localStorage.getItem('user');
  const [user, setUser] = useState<IUser | null>(initialUser ? JSON.parse(initialUser) : null);

  const login = async (username: string, password: string) => {
    if (username && password) {
      try {
        const loggedInUser = await authService.login(username, password);
        setUser(loggedInUser);
      } catch (error) {
        console.log('Login error');
      }
    } else {
      console.log('Login error. Username and password must be valid')
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
