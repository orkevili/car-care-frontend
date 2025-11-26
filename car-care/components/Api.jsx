import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Lejárt a munkamenet.");
            window.location.href = '/login'
        }
        return Promise.reject(error);
    }
);

export const AuthAPI = {
    login: (username, password) => apiClient.post('/login', { username, password }),
    logout: () => apiClient.post('/logout'), 
    getCurrentUser: () => apiClient.get('/'), 
};

export const VehicleAPI = {
    getAll: () => apiClient.get('/vehicles'),
    // ... többi metódus
};

export default apiClient;