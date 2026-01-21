import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8085/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000
});

api.interceptors.request.use(config => {
    // ✅ 로그인 요청은 Authorization 제외
    if (config.url.includes('/auth/login')) {
        return config;
    }
    if (config.url.includes('/auth/register')) {
        return config;
    }

    const token = (document.cookie.split('; ').find(row => row.startsWith('token=')) || '').split('=')[1];


    if (token) {
        // ⚠️ 대소문자 주의 (Authorization)
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;