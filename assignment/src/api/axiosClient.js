import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "https://6ae42d03933120ae20f98d78.mockapi.io/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000,
});
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }

)

export default axiosClient;