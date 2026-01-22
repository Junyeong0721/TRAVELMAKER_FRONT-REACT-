import api from '../axiosSetting';

export const MyInfo = (token) => {
    return api.get('/myinfo/mypageinfo', { params: { "token": token } });
}