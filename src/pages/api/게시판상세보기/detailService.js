import api from '../axiosSetting';

export const boardDetail = (idx) => {
    return api.get("board/detail", { params: { idx } });
}