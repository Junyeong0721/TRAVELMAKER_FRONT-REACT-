import api from '../axiosSetting';

export const SelectPlan = (token) => {
    return api.get('/board/selectplan', { params: { "token": token } });
}