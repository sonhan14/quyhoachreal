import api from "../utils/axios-customize";

export const callLogin = (username, password) => {
    return api.post('/api/login',{username, password})
}