import api from '../axiosSetting';

export const edit = (idx) => {
    return api.get('/board/edit', { params: { idx } });
}