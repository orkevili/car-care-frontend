import { createContext, useState, useEffect } from "react";
import { AuthAPI } from "./Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await AuthAPI.getCurrentUser();
                setUser(response.data); 
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        try {
            await AuthAPI.login(username, password);
            const userResponse = await AuthAPI.getCurrentUser();
            setUser(userResponse.data);
            return { success: true };
        } catch (error) {
            let errorMessage = "Hiba történt.";
             if (error.response && error.response.data) {
                errorMessage = error.response.data.message || JSON.stringify(error.response.data);
             }
             return { success: false, message: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } catch (e) {
            console.error(e);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};