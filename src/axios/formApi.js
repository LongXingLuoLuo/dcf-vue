import api from "@/axios/api.js";

const formApi = {}

/**
 * 根据表单id获取表单
 * @param id
 * @returns {Promise<Object>} 返回表单
 */
formApi.getFormById = async (id) => {
    return await api.get("/form/get", {
        params: {
            id: id
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.form;
            } else
                return null
        })
        .catch(err => {
            return null
        })
}

/**
 * 获取指定管理员下的所有表单
 * @param managerId 管理员id
 * @returns {Promise<Array<Object>>} 返回表单列表
 */
formApi.getAllFormsByManagerId = async (managerId) => {
    return await api.get("/form/get/all", {
        params: {
            managerId: managerId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.forms;
            } else
                return []
        })
        .catch(err => {
            return []
        })
}

formApi.getAllVisitableForms = async (userId) => {
    return await api.get("/form/get/all/visitable", {
        params: {
            userId: userId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.forms;
            } else
                return []
        })
        .catch(() => {
            return []
        })

}

formApi.getManagerByFormId = async (id) => {
    return await api.get("/form/get/manager", {
        params: {
            id: id
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.manager
            } else {
                return null
            }
        })
        .catch(err => {
            console.error(err)
            return null
        });
}

/**
 * 添加新表单
 * @param managerId 管理员id
 * @returns {Promise<Object>} 返回表单
 */
formApi.saveFormWithManagerId = async (managerId) => {
    return await
        api
            .post("/form/save", {
                title: "新表单",
                description: "这是一个新表单",
                manager: {
                    id: managerId
                }
            },)
            .then(res => {
                if (res.data.code === 200) {
                    return res.data.form
                } else {
                    return null
                }
            })
            .catch(err => {
                return null
            });
}

/**
 * 更新表单
 * @param form 表单
 * @returns {Promise<Boolean>} 是否更新成功
 */
formApi.updateForm = async (form) => {
    return await api.post("/form/update", form)
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}

formApi.updateRef = async (formId, refId) => {
    return await api.post("/form/update/ref", null, {
        params: {
            formId: formId,
            refId: refId
        }
    })
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}

formApi.updateVisited = async (formId, userId) => {
    return await api.post("/form/update/visited", null, {
        params: {
            formId: formId,
            userId: userId
        }
    })
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}

formApi.existVisited = async (formId, userId) => {
    return await api.get("/form/exist/visited", {
        params: {
            formId: formId,
            userId: userId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.exist
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        });

}

formApi.countAllNonVisitedForms = async (userId) => {
    return await api.get("/form/count/all/nonVisited", {
        params: {
            userId: userId
        }
    })
        .then(res => {
            return res.data.count
        })
        .catch(() => {
            return 0
        });

}

formApi.isVisitable = async (formId, userId) => {
    return await api.get("/form/is/visitable", {
        params: {
            formId: formId,
            userId: userId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.is
            } else {
                return false;
            }
        })
        .catch(() => {
            return false
        });
}

/**
 * 根据表单id删除表单
 * @param formId 表单id
 * @returns {Promise<Boolean>} 是否删除成功
 */
formApi.deleteFormById = async (formId) => {
    return await api.delete("/form/delete", {
        params: {
            id: formId
        }
    })
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}

export default formApi