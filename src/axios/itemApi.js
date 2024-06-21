import api from "@/axios/api.js";

const itemApi = {}
/**
 * 根据表单项id获取表单项
 * @param id
 * @return {Promise<Object>} 返回表单项
 */
itemApi.getItemById = async (id) => {
    return await api.get("/form/item/get", {
        params: {
            id: id
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.formItem
            } else {
                return null
            }
        })
        .catch(() => {
            return null
        })
}

/**
 * 根据表单id获取所有的表单项
 * @returns {Promise<Array<Object>>} 返回表单项列表
 */
itemApi.getAllItems = async () => {
    return await api.get("/form/item/get/all")
        .then(res => {
            if (res.data.code === 200) {
                return res.data.formItems
            } else {
                return []
            }
        })
        .catch(() => {
            return []
        })
}

/**
 * 根据表单id获取所有的表单项
 * @param formId 表单id
 * @returns {Promise<Array<Object>>} 返回表单项列表
 */
itemApi.getAllItemsByFormId = async (formId) => {
    return await api.get("/form/item/get/all", {
        params: {
            formId: formId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.formItems
            } else {
                return []
            }
        })
        .catch(() => {
            return []
        })
}

/**
 * 添加新的表单项
 * @param item 表单项
 * @returns {Promise<Object>} 返回表单项
 */
itemApi.saveFormItem = async (item) => {
    return await
        api
            .post("/form/item/save", item)
            .then(res => {
                if (res.data.code === 200) {
                    return res.data.formItem
                }
                return null
            })
            .catch(() => {
                return null
            });
}
/**
 * 更新表单项
 * @param item 表单项
 * @returns {Promise<Boolean>} 是否更新成功
 */
itemApi.updateItem = async (item) => {
    return await
        api
            .post("/form/item/update", item)
            .then(res => {
                return res.data.code === 200
            })
            .catch(() => {
                return false
            });
}
/**
 * 删除表单项
 * @param id 表单项id
 * @returns {Promise<Boolean>} 是否删除成功
 */
itemApi.deleteItem = async (id) => {
    return await api.delete("/form/item/delete", {
        params: {
            id: id
        }
    })
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}
export default itemApi