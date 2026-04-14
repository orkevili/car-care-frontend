import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/',
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
            if (error.config.url.includes('login/')) {
                return Promise.reject(error);
            }
            console.warn("Session expired or unauthorized");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.reload()
        }
        return Promise.reject(error);
    }
);

export const FileAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('backup_file', file);
        return apiClient.post('/data/import/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    exportData: () => apiClient.get('/data/export/')
};

export const AuthAPI = {
    register: (username, password) => apiClient.post('/register/', { username, password }),
    login: (username, password) => apiClient.post('/login/', { username, password }),
    logout: () => apiClient.get('/logout/'), 
    getUserData: () => apiClient.get('/me/'), 
    deleteProfile: () => apiClient.delete('/account/delete/')
};

export const VehicleAPI = {
    getAll: () => apiClient.get('/vehicles/'),
    create: (newCar) => apiClient.post('/vehicles/', newCar, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    delete: (id) => apiClient.delete(`/vehicles/${id}/`),
    update: (id, updatedCar) => apiClient.patch(`/vehicles/${id}/`, updatedCar, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const ServiceAPI = {
    getAll: () => apiClient.get('/services/'),
    getById: (vehicle_id) => apiClient.get(`vehicles/${vehicle_id}/services/`),
    create: (vehicle_id, newService) => apiClient.post(`vehicles/${vehicle_id}/services/`, newService),
    update: (service_id, updatedService) => apiClient.patch(`services/${service_id}/`, updatedService),
    delete: (service_id) => apiClient.delete(`/services/${service_id}/`)
};

export const PartAPI = {
    getById: (vehicle_id) => apiClient.get(`vehicles/${vehicle_id}/supplies/`),
    create: (vehicle_id, newPart) => apiClient.post(`vehicles/${vehicle_id}/supplies/`, newPart),
    update: (partId, updatedPart) => apiClient.patch(`supplies/${partId}/`, updatedPart),
    delete: (partId) => apiClient.delete(`supplies/${partId}/`)
};

export default apiClient;