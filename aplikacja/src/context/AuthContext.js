import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sprawdź czy użytkownik jest zalogowany (localStorage)
        const sessionToken = localStorage.getItem('sessionToken');
        const savedUser = localStorage.getItem('user');

        if (sessionToken && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            if (response.data.success) {
                const { sessionToken, user } = response.data;

                // Zapisz w localStorage
                localStorage.setItem('sessionToken', sessionToken);
                localStorage.setItem('user', JSON.stringify(user));

                // Ustaw w axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;

                setUser(user);
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            if (sessionToken) {
                await axios.post('/api/auth/logout', {}, {
                    headers: { Authorization: `Bearer ${sessionToken}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Wyczyść localStorage i state
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin: user?.isAdmin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
