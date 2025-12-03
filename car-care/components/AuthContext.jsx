import { createContext, useState, useEffect } from "react";
import { AuthAPI } from "./Api";
import { toast, ToastContainer } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true);
    const [serverDown, setServerDown] = useState(false)

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await AuthAPI.getUserData();
                setServerDown(false)
                if (response.data.msg) {
                    setMessage(response.data.msg);
                } else {
                    setUser(response.data.user);
                    setMessage(response.data); 
                }
                toast.info(response.data.msg)
            } catch (error) {
                if (!error.response || error.code === 'ECONNREFUSED') {
                    setTimeout(checkLoggedIn, 5000)
                    setServerDown(true)
                }   
                toast.error("Trying to reconnect in 5 seconds.")
                setUser(null);
            } finally {
                if(!serverDown) {
                    setLoading(false);
                }
            }
        };
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if(user) {
            localStorage.setItem("user", user)
        } else {
            localStorage.removeItem("user")
        }
    }, [user])

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
            await AuthAPI.login(username, password);
            const response = await AuthAPI.getUserData();
            setUser(response.data.user);
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
        <AuthContext.Provider value={{ user, register, login, logout, message, setMessage, loading, serverDown }}>
            {children}
            <ToastContainer
                position="top-top-right"
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