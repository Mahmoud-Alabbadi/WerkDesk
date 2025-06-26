import React, { createContext, useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';

    export const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();

      useEffect(() => {
        const storedUser = localStorage.getItem('werkdeskUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }, []);

      const login = (userData) => {
        const fakeUser = { ...userData, name: userData.email.split('@')[0] }; 
        localStorage.setItem('werkdeskUser', JSON.stringify(fakeUser));
        setUser(fakeUser);
        navigate(fakeUser.role === 'Admin' ? '/admin/dashboard' : '/partner/dashboard');
      };

      const logout = () => {
        localStorage.removeItem('werkdeskUser');
        setUser(null);
        navigate('/login');
      };

      const value = {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        logout,
        loading
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };