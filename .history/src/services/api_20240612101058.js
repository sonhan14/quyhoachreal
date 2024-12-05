import instance from "../utils/axios-customize";

export const callLogin = (userName, password) => {
    return instance.post('/api/login',{userName, password})
}