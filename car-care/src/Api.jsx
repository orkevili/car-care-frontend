import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 5000,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = '/login/';
        }
        return Promise.reject(error);
    }
);

export const AuthAPI = {
    register: (username, password) => apiClient.post('/register/', { username, password }),
    login: (username, password) => apiClient.post('/login/', { username, password }),
    logout: () => apiClient.get('/logout/'), 
    getUserData: () => apiClient.get('/me/'), 
};

export const VehicleAPI = {
    getAll: () => apiClient.get('/vehicles/'),
    create: (newCar) => apiClient.post('/vehicles/', { newCar }),
    delete: (id) => apiClient.delete(`/vehicles/${id}/`),
    update: (id, updatedCar) => apiClient.put(`/${id}`, updatedCar)
};

export const ServiceAPI = {
    getAll: () => apiClient.get('/services/'),
    getById: (id) => apiClient.get(`vehicles/${id}/services/`),
    create: (vehicle_id, newService) => apiClient.post(`vehicles/${vehicle_id}/services/`, { newService }),
    update: (service_id, vehicle_id, updatedService) => apiClient.post(`vehicles/${vehicle_id}/${service_id}/`, {updatedService}),
    delete: (service_id, vehicle_id) => apiClient.delete(`vehicles/${vehicle_id}/${service_id}/`)
}

export default apiClient;