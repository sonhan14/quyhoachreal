import api from "../utils/axios-customize";

export const callLogin = (Username, Password) => {
    return api.post('/api/login',{Username, Password})
}