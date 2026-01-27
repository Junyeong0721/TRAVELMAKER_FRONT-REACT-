import api from '../axiosSetting';

export const update = (obj) => {
    return api.post('/board/update', JSON.stringify(obj));
}