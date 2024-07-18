import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API functions
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/login', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Info API functions
export const createUserInfo = async (userInfo, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.post('/info/create', userInfo);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const updateUserInfo = async (id, userInfo, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.put(`/info/update/${id}`, userInfo);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getUserInfo = async (id, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get(`/info/get/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Training API functions
export const createTraining = async (trainingData, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.post('/training/create', trainingData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const updateTraining = async (id, trainingData, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.put(`/training/update/${id}`, trainingData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getTraining = async (id, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get(`/training/get/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const getAllTrainings = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/training/get');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};