export function getCookie(name) { //테스트용
    const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    return value ? value.split('=')[1] : null;
}