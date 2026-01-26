import api from '../axiosSetting';

export const deletePost = (idx) => {
    return api.get('/board/delete', { params: { idx } });
}