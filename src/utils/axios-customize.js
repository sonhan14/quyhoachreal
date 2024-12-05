import axios from 'axios';
// Create Axios instance
const instance = axios.create({
    baseURL: `https://api.quyhoach.xyz`,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
});

// Handle token refresh
const handleRefreshToken = async (userId) => {
    try {
        const res = await instance.post(`/refresh_token/${userId}`);
        if (res && res.data) {
            const access_token = res.data.access_token;
            localStorage.setItem('refresh_token', access_token);
            return access_token;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed', error);
        return null;
    }
};

// Request interceptor
instance.interceptors.request.use(
    function (config) {
        // Log config before request is sent
        return config;
    },
    function (error) {
        // Handle request error
        return Promise.reject(error);
    },
);

const NO_RETRY_HEADER = 'x-no-retry';

// Response interceptor
instance.interceptors.response.use(
    function (response) {
        // Return response if successful
        return response;
    },
    async function (error) {
        const originalConfig = error.config;
        const userId = localStorage.getItem('user_id'); // Assuming the user ID is stored in localStorage

        // Handle 401 errors (Unauthorized)
        if (error.response && error.response.status === 401 && !originalConfig.headers[NO_RETRY_HEADER]) {
            const access_token = await handleRefreshToken(userId);
            if (access_token) {
                originalConfig.headers[NO_RETRY_HEADER] = 'true';
                originalConfig.headers['Authorization'] = `Bearer ${access_token}`;
                return instance.request(originalConfig);
            }
        }

        // Redirect to login on 400 error during refresh
        if (error.response && error.response.status === 400 && originalConfig.url === `/refresh_token/${userId}`) {
            window.location.href = './login';
        }

        return Promise.reject(error.response ? error.response.data : error);
    },
);

export default instance;
