import api from "@/axios/api.js";

const userApi = {}

userApi.getAllUsers = async () => {
    return await api.get("/user/get/all")
        .then(res => {
            if (res.data.code === 200)
                return res.data.users
            else
                return []
        })
        .catch(() => {
            return []
        });

}

userApi.getUserById = async (userId) => {
    return await api.get("/user/get", {
        params: {
            id: userId
        }
    })
        .then(res => {
            if (res.data.code === 200)
                return res.data.user
            else
                return null
        })
        .catch(err => {
            return err.status
        });
}

userApi.setAdmin = async (userId) => {
    return await api.post("/user/role/add/admin", null, {
        params: {
            userId: userId
        }
    })
        .then(res => {
            return res.data.code
        })
        .catch(err => {
            return err.status
        });
}

export default userApi