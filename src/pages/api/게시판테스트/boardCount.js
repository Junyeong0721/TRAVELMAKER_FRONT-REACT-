import api from '../axiosSetting';

export const boardCount = () => {
    return api.get("board/count");
}