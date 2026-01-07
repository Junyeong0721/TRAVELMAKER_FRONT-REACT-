import api from '../axiosSetting';

export const register = (obj) => {
    return api.post('/auth/register', JSON.stringify(obj));
}