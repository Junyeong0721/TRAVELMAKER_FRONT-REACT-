import api from '../axiosSetting';

export const boardList = (offset, searchTerm = '') => {
    // 검색어가 있으면 컨트롤러에 만든 /board/search로, 없으면 /board/list로!
    const url = searchTerm ? "/board/search" : "/board/list";

    return api.get(url, {
        params: {
            offset: offset,
            keyword: searchTerm // 컨트롤러의 @RequestParam String keyword와 매칭
        }
    });
}