import axios from "axios";
import useTokenStore from "@/stores/token.js";
import useUserStore from "@/stores/user.js";

const api = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;',
    }
})

api.interceptors.request.use((config) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    const useToken = useTokenStore();
    if (useToken.token) {
        config.headers["token"] = useToken.token;
    }
    // 若请求方式为post，则将data参数转为JSON字符串
    if (config.method === 'POST') {
        config.data = JSON.stringify(config.data);
    }
    return config;
}, (error) => {
    // 处理请求错误
    return Promise.reject(error);
})

api.interceptors.response.use((response) => {
    // 处理响应数据
    if (response.headers["token"]) {
        console.log(`token is ${response.headers["token"]}`)
        const tokenStore = useTokenStore();
        tokenStore.setToken(response.headers['token']);
        const userStore = useUserStore();
        userStore.updateUser();
    }
    if (response.data.code === 401) {
        console.log("token过期")
        const tokenStore = useTokenStore();
        tokenStore.clearToken();
        const userStore = useUserStore();
        userStore.clearUser();
    }
    return response;
}, (error) => {
    // 处理请求错误
    return Promise.reject(error);
})
export default api