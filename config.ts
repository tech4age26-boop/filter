const __DEV__ = false;
export const API_BASE_URL = __DEV__
    ? 'http://192.168.1.7:5000'
    : 'https://filter-server.vercel.app';

export const CONFIG = {
    API_BASE_URL,
    TIMEOUT: 10000,
};

export default CONFIG;
