import api from '../axiosSetting';

export const bestList = (offset) => {
    return api.get("/board/bestlist", {
        params: {
            offset: offset
        }
    });
}