import api from '../axiosSetting';

export const comment = (obj) => {
    return api.get("board/comment", { params: obj });
}