import { createContext, useState, useEffect } from "react";
import { AuthAPI } from "../Api";
import { toast, ToastContainer } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true);
    const [serverDown, setServerDown] = useState(false)

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await AuthAPI.getUserData();
                setServerDown(false);
                setUser(response.data.user);
                
                if (response.data.msg) {
                    setMessage(response.data.msg);
                }
            } catch (error) {
                console.warn("Session expired or server unreachable.");
                setUser(null);
                
                if (error.code === 'ERR_NETWORK') {
                    setServerDown(true);
                    toast.error("Nem sikerült kapcsolódni a szerverhez.");
                }
                
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const register = async (username, password) => {
        try {
            const response = await AuthAPI.register(username, password);
            setMessage(response.data.msg)
            return {success: true}

        } catch (error) {
            console.error(error)
            return {success: false, message: error}
        }
    }

    const login = async (username, password) => {
        try {
            const loginResponse = await AuthAPI.login(username, password);
            const { access, refresh } = loginResponse.data;

            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            try {
                 const userResponse = await AuthAPI.getUserData();
                 setUser(userResponse.data.user || username);
            } catch(userError) {
                console.warn('No user data found.');
                setUser(username);
            }

            return { succes: true, access, refresh };
            
        } catch (error) {
            let errorMessage = "Hiba történt."
            if (error.response && error.response.data) {
                errorMessage = error.response.data.detail || JSON.stringify(error.response.data);
                toast.errror(errorMessage);
            }
            return { success: false, message: errorMessage };
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } catch (e) {
            console.error(e);
        }
        setUser(null);
        toast.info("Logged out.");
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, message, setMessage, loading, serverDown }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" 
                toastStyle={{ 
                    backgroundColor: 'transparent', 
                    border: 'none',
                }}
            />
        </AuthContext.Provider>
    );
};