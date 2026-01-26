import api from '../axiosSetting';

export const getTop3Posts = () => {
    return api.get('/board/top3');
}