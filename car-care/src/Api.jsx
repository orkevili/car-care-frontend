import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5555/',
    timeout: 5000,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            console.warn("Session expired");
            window.location.href = '/'
        }
        return Promise.reject(error);
    }
);

export const AuthAPI = {
    register: (username, password) => apiClient.post('/register', { username, password }),
    login: (username, password) => apiClient.post('/login', { username, password }),
    logout: () => apiClient.get('/logout'), 
    getUserData: () => apiClient.get('/'), 
};

export const VehicleAPI = {
    getAll: () => apiClient.get('/vehicles'),
    create: (newCar) => apiClient.post('/vehicles', { newCar }),
    delete: (id) => apiClient.delete(`/${id}`),
    update: (id, newCar) => apiClient.post(`/${id}`, { newCar })
};

export const ServiceAPI = {
    getAll: () => apiClient.get('/services'),
    getById: (id) => apiClient.get(`/${id}/services`),
    create: (vehicle_id, newService) => apiClient.post(`/${vehicle_id}/services`, { newService }),
    update: (service_id, vehicle_id, updatedService) => apiClient.post(`/${vehicle_id}/${service_id}`, {updatedService}),
    delete: (service_id, vehicle_id) => apiClient.delete(`/${vehicle_id}/${service_id}`)
}

export default apiClient;