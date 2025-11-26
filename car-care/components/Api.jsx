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
            window.location.href = '/'
        }
        return Promise.reject(error);
    }
);

export const AuthAPI = {
    login: (username, password) => apiClient.post('/login', { username, password }),
    logout: () => apiClient.get('/logout'), 
    getCurrentUser: () => apiClient.get('/'), 
};

export const VehicleAPI = {
    getAll: () => apiClient.get('/vehicles'),
    create: (newCar) => apiClient.post('/vehicles', { newCar }),
    delete: (id) => apiClient.delete(`/${id}`),
    update: (id, newCar) => apiClient.post(`/${id}`, { newCar })
};

export const ServiceAPI = {
    getAll: () => apiClient.get('/services'),
    getById: (id) => apiClient.get(`/${id}/services`)
}

export default apiClient;