import api from '../axiosSetting';

export const boardList = (offset) => {
    return api.get("/board/list", {
        params: {
            offset: offset
        }
    });
}