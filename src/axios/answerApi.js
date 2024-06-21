import api from "@/axios/api.js";

const answerApi = {}

/**
 * 根据用户id和表单项id获取用户回答的答案
 * @param userId 用户id
 * @param itemId 表单项id
 * @returns {Promise<Array<Object>>} 返回用户对于该表单项的回答的答案
 */
answerApi.getAllAnswersByUserIdAndItemId = async (userId, itemId) => {
    return await api.get("/form/answer/get/all", {
        params: {
            userId: userId,
            formItemId: itemId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.answers
            } else {
                return []
            }
        })
        .catch(() => {
            return []
        })
}
/**
 * 获取该表单的所有答案
 * @param formId 表单id
 * @returns {Promise<Array<Object>>} 返回该表单的所有答案
 */
answerApi.getAllAnswersByFormId = async (formId) => {
    return await api.get("/form/answer/get/all", {
        params: {
            formId: formId
        }
    })
        .then(res => {
            if (res.data.code === 200) {
                return res.data.answers
            } else {
                return []
            }
        })
        .catch(() => {
            return []
        })
}
/**
 * 获取该表单项的所有答案
 * @param itemId 表单项id
 * @returns {Promise<Array<Object>>} 返回该表单项的所有答案
 */
answerApi.getAllAnswersByItemId = async (itemId) => {
    return await
        api
            .get("/form/answer/get/all", {
                params: {
                    formItemId: itemId
                }
            })
            .then(res => {
                if (res.data.code === 200) {
                    return res.data.answers
                } else {
                    return []
                }
            })
            .catch(() => {
                return []
            })

}
/**
 * 保存用户的回答
 * @param answer 需要保存的答案
 * @returns {Promise<Object>} 返回是否保存成功
 */
answerApi.saveAnswer = async (answer) => {
    return await api.post("/form/answer/save", answer)
        .then(res => {
            if (res.data.code === 200) {
                return res.data.answer
            } else {
                return null
            }
        })
        .catch(() => {
            return null
        });
}

/**
 * 更新用户的回答
 * @param answer 需要更新的答案
 * @returns {Promise<Boolean>} 返回是否更新成功
 */
answerApi.updateAnswer = async (answer) => {
    return await api.post("/form/answer/update/content", answer)
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            return false
        });
}

answerApi.deleteAnswer = async (answerId) => {
    return await api.delete("/form/answer/delete", {
        params: {
            id: answerId
        }
    })
        .then(res => {
            return res.data.code === 200
        })
        .catch(() => {
            console.log("delete answer failed")
            return false
        });
}

export default answerApi