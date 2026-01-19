import api from '../axiosSetting';

export const write = (obj) => {
    return api.post("board/write", JSON.stringify(obj));
}