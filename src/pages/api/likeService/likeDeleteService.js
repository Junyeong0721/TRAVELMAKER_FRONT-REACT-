import api from '../axiosSetting';

export const deleteLike = (idx, token) => {
    return api.get(`/like/delete`, { params: { postIdx: idx, token: token } });
}