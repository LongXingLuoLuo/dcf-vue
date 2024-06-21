import {defineStore} from 'pinia'
import {ref} from 'vue'
import useTokenStore from "@/stores/token.js";
import authApi from "@/axios/authApi.js";

const useUserStore = defineStore('user', () => {
        const user = ref({id: -1, username: ''})

        const setUser = (newUser) => {
            console.log('set user')
            user.value = newUser
        }

        const updateUser = () => {
            console.log('update user')
            const useToken = useTokenStore();
            if (!useToken.token || useToken.token === '') {
                removeUser();
                return
            }
            authApi.getSelf().then((res) => {
                setUser(res)
            }).catch((err) => {
                console.log(err)
            })
        }

        const removeUser = () => {
            console.log('remove user')
            setUser({id: -1, username: ''});
        }

        return {user, setUser, updateUser, removeUser}
    }, {
        persist: {
            enabled: true,
            strategies: [
                {
                    name: 'user',
                    storage: window.localStorage,
                    paths: ['user']
                }
            ]
        }
    }
)

export default useUserStore