import api from '../axiosSetting';

export const addLike = (idx, token) => {
    return api.get('/like/add', { params: { postIdx: idx, token: token } });
}