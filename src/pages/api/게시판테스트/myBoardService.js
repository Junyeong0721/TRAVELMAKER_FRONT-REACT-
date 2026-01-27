import api from '../axiosSetting';

export const myList = (offset, token) => {
    return api.get("/board/mylist", {
        params: {
            offset: offset,
            token: token
        }
    });
}