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

export const changePassword = async (passwordData, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.post('/auth/change-password', passwordData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

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

export const deleteTraining = async (id, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.delete(`/training/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

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

// Match API functions
export const createMatch = async (matchData, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.post('/match/create', matchData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const updateMatch = async (id, matchData, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.put(`/match/update/${id}`, matchData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const deleteMatch = async (id, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.delete(`/match/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getMatch = async (id, token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get(`/match/get/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getAllMatches = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/match/get');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getPositions = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/positions');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getPhysicalTrainings = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/physicalTraining');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getTechnicalTrainings = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/technicalTraining');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getTacticalTrainings = async (token) => {
    try {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/tacticalTraining');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


