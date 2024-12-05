import axios from 'axios';
const httpRequest = axios.create({
    baseURL: process.env.BACKEND_URL,
});


export default httpRequest;