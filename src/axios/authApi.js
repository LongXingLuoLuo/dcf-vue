import api from "@/axios/api.js";

const authApi = {}

/**
 * 用户使用账号密码登录
 * @param username 用户名
 * @param password 密码
 * @returns {Promise<AxiosResponse<any>>} 成功则返回状态码，失败则返回错误信息
 */
authApi.login = async (username, password) => {
    return await api.post('/auth/login', null, {
        params: {
            username: username,
            password: password
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.code
            } else {
                return res.data.message
            }
        })
        .catch(err => {
            return err.status
        });
}

/**
 * 用户使用账号密码注册
 * @param username 用户名
 * @param password 密码
 * @returns {Promise<AxiosResponse<any>>} 成功则返回状态码，失败则返回错误信息
 */
authApi.register = async (username, password) => {
    return await api.post('/auth/register', null, {
        params: {
            username: username,
            password: password
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.code
            } else {
                return res.data.message
            }
        })
        .catch(err => {
            return err.status
        });
}
/**
 * 用户登出
 * @returns {Promise<Boolean>} 是否登出成功
 */
authApi.logout = async () => {
    return await api.post('/auth/logout')
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}
/**
 * 获取当前登录用户信息
 * @returns {Promise<Object>} 用户信息
 */
authApi.getSelf = async () => {
    return await api.get('/auth/self')
        .then(res => {
            if (res.data.code === 200) {
                return res.data.user
            } else {
                return null
            }
        })
        .catch(() => {
            return null
        });
}
export default authApi;