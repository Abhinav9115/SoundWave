import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@shared/schema'; // Assuming User type is available

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean; // To indicate if we are currently verifying token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true

  const verifyToken = useCallback(async () => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token valid but no user data, or unexpected response
            localStorage.removeItem('jwt_token');
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        } else {
          // Token verification failed (e.g., expired, invalid)
          localStorage.removeItem('jwt_token');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('jwt_token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('jwt_token', newToken);
    setUser(userData);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    // Optionally, redirect to login or home page
    // navigate('/login'); // if using wouter's navigate
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
