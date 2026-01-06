import api from '../axiosSetting';

export const login = (obj) => {
    return api.post('/auth/login', JSON.stringify(obj));
}