import {defineStore} from 'pinia'
import {ref} from 'vue'

const useTokenStore = defineStore('token', () => {
        const token = ref('')

        const setToken = (newToken) => {
            console.log('set token')
            token.value = newToken
        }

        const removeToken = () => {
            console.log('remove token')
            token.value = ''
        }

        return {token, setToken, removeToken}
    }, {
        persist: {
            enabled: true,
            strategies: [
                {
                    name: 'token',
                    storage: window.localStorage,
                    paths: ['token']
                }
            ]
        }
    }
)

export default useTokenStore