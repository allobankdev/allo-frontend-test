import axios from 'axios';

const axiosModule = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        post: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            withCredentials: true,
        },
    },
});

export default axiosModule;
