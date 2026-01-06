const __DEV__ = true;
export const API_BASE_URL = __DEV__
    ? 'http://192.168.1.4:5000'
    : 'https://filter-server.vercel.app';

export const CONFIG = {
    API_BASE_URL,
    TIMEOUT: 10000,
};

export default CONFIG;
