import api from '../axiosSetting';

export const boardList = () => {
    return api.get("/board/list");
}