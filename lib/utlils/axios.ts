import { API_BASE_URL } from '../app/app_constants';
import axios from 'axios'
import { getAuthTokenFromCookie } from './utill_methods';

const baseURL = API_BASE_URL;
const isServer = typeof window === 'undefined';

const axiosClient = axios.create({ baseURL })

axiosClient.interceptors.request.use(async config => {
    
    if (isServer) {

        const { cookies } = (await import('next/headers'))
        const token = cookies().get('authToken')?.value;
        const alreadyHasToken = config.headers['auth-token'] != null && config.headers['auth-token'] != ''

        if (token && alreadyHasToken == false) {
            config.headers['auth-token'] = token
        }
    } else {
        const token = getAuthTokenFromCookie(document.cookie);

        if (token) {
            config.headers['auth-token'] =  token
        }
    }

    return config
})

export default axiosClient;
