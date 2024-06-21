import api from "@/axios/api.js";

const objectApi = {}

/**
 * 获取所有对象
 * @returns {Promise<Array<Object>>} 返回对象列表
 */
objectApi.getAllObjects = async () => {
    return await
        api.get("/object/get/all")
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.objects;
                } else {
                    return [];
                }
            })
            .catch(() => {
                return []
            })
}

/**
 * 根据 object id 获取 object
 *
 * @returns {Promise<Object>} 返回 object
 */
objectApi.getObjectById = async (id) => {
    return await
        api.get("/object/get", {params: {id: id}})
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.object;
                } else {
                    return null;
                }
            })
            .catch(() => {
                return null
            })
}

/**
 * 新增 object
 * @param name object 名称
 * @param type object 类型
 * @returns {Promise<object>} 返回 object
 */
objectApi.saveObject = async (name, type) => {
    return await
        api.post("/object/save", {name: name, type: type})
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.object;
                } else {
                    return null;
                }
            })
            .catch(() => {
                return null;
            })
}
/**
 * 更新 object
 * @param object object 对象
 * @returns {Promise<Boolean>} 是否更新成功
 */
objectApi.updateObject = async (object) => {
    return await
        api.post("/object/update", object)
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })

}
/**
 * 删除 object
 * @param id object id
 * @returns {Promise<Boolean>} 是否删除成功
 */
objectApi.deleteObject = async (id) => {
    return await
        api.delete("/object/delete", {params: {id: id}})
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })
}

/**
 * 获取所有属性
 * @returns {Promise<Array<Property>>} 返回属性列表
 */
objectApi.getAllProperties = async () => {
    return await
        api.get("/object/property/get/all")
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.properties;
                } else {
                    return [];
                }
            })
            .catch(() => {
                return []
            })
}

/**
 * 获取所有属性
 * @param modelId 模型 id
 * @returns {Promise<Array<Property>>} 返回属性列表
 */
objectApi.getAllPropertiesByModel = async (modelId) => {
    return await
        api.get("/object/property/get/all", {
            params: {
                modelId: modelId
            }
        })
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.properties;
                } else {
                    return [];
                }
            })
            .catch(() => {
                return []
            })
}

/**
 * 根据 id 获取属性
 * @param id 属性 id
 * @returns {Promise<Property>} 返回属性
 */
objectApi.getPropertyById = async (id) => {
    return await
        api.get("/object/property/get", {params: {id: id}})
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.property;
                } else {
                    return null;
                }
            })
            .catch(() => {
                return null
            })
}

/**
 * 新增属性
 * @param property 属性对象
 * @returns {Promise<Property>} 返回属性
 */
objectApi.saveProperty = async (property) => {
    return await
        api.post("/object/property/save", property)
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.property;
                } else {
                    return null;
                }
            })
            .catch(() => {
                return null;
            })
}

/**
 * 更新属性
 * @param property
 * @returns {Promise<boolean>}
 */
objectApi.updateProperty = async (property) => {
    return await
        api.post("/object/property/update", property)
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })
}

/**
 * 删除属性
 * @param id 属性 id
 * @returns {Promise<boolean>} 是否删除成功
 */
objectApi.deleteProperty = async (id) => {
    return await
        api.delete("/object/property/delete", {id: id})
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })
}

/**
 * 根据 object id 获取 object 的所有属性
 * @param objectId object id
 * @returns {Promise<Array<Property>>} 返回属性列表
 */
objectApi.getAllPropertiesByObject = async (objectId) => {
    return await
        api.get("/object/property/get/all", {params: {customObjectId: objectId}})
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data.properties;
                } else {
                    return [];
                }
            })
            .catch(() => {
                return []
            })
}

/**
 * 为 object 添加属性
 * @param objectId object id
 * @param propertyId 属性 id
 * @returns {Promise<boolean>} 是否添加成功
 */
objectApi.addProperty = async (objectId, propertyId) => {
    return await
        api.post("/object/property/add", null, {
            params: {
                customObjectId: objectId,
                customPropertyId: propertyId
            }
        })
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })
}

/**
 * 为 object 删除属性
 * @param objectId object id
 * @param propertyId 属性 id
 * @returns {Promise<boolean>} 是否删除成功
 */
objectApi.removeProperty = async (objectId, propertyId) => {
    return await
        api.post("/object/property/remove", null, {
            params: {
                customObjectId: objectId,
                customPropertyId: propertyId
            }
        })
            .then((res) => {
                return res.data.code === 200;
            })
            .catch(() => {
                return false;
            })
}

export default objectApi