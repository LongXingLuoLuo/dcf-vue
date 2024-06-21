import api from "@/axios/api.js";

const modelApi = {}

modelApi.getAllModels = async () => {
    return await api.get("/model/get/all")
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.models;
            } else {
                return [];
            }
        })
        .catch(() => {
            return [];
        });
}

modelApi.getAllModelsByInfosContains = async (infoId) => {
    return await api.get("/model/get/all", {
        params: {
            infoId: infoId
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.models;
            } else {
                return [];
            }
        })
        .catch(() => {
            return [];
        });
}

modelApi.getAllByInfosContainsAndNameLike = async (infoId, name) => {
    return await api.get("/model/get/all", {
        params: {
            infoId: infoId,
            name: name
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.models;
            } else {
                return [];
            }
        })
        .catch(() => {
            return [];
        });
}

modelApi.getModelById = async (id) => {
    return await api.get("/model/get", {
        params: {
            id: id
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.model;
            } else {
                return null;
            }
        })
        .catch(() => {
            return null;
        });
}

modelApi.getModelByName = async (name) => {
    return await api.get("/model/get", {
        params: {
            name: name
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.model;
            } else {
                return null;
            }
        })
        .catch(() => {
            return null;
        });
}

modelApi.saveModel = async (model) => {
    return await api.post("/model/save", model)
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.model;
            } else {
                return null;
            }
        })
        .catch(() => {
            return null;
        });
}

modelApi.updateModel = async (model) => {
    return await api.post("/model/update", model)
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });
}

modelApi.updateModelAddInfo = async (modelId, infoId) => {
    return await api.post("/model/update/infos/add", null, {
        params: {
            modelId: modelId,
            infoId: infoId
        }
    })
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });

}

modelApi.updateModelRemoveInfo = async (modelId, infoId) => {
    return await api.post("/model/update/infos/remove", null, {
        params: {
            modelId: modelId,
            infoId: infoId
        }
    })
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });

}

modelApi.deleteModel = async (id) => {
    return await api.delete("/model/delete", {
        params: {
            id: id
        }
    })
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });
}

modelApi.getAllValues = async () => {
    return await api.get("/model/value/get/all")
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.values;
            } else {
                return [];
            }
        })
        .catch(() => {
            return [];
        });
}

modelApi.getValueById = async (id) => {
    return await api.get("/model/value/get", {
        params: {
            id: id
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.value;
            } else {
                return null;
            }
        })
        .catch(() => {
            return null;
        });
}

modelApi.getAllValuesByModelAndProperty = async (modelId, propertyId) => {
    return await api.get("/model/value/get/all", {
        params: {
            modelId: modelId,
            propertyId: propertyId
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.values;
            } else {
                return [];
            }
        })
        .catch(() => {
            return [];
        });
}

modelApi.saveValue = async (value) => {
    return await api.post("/model/value/save", value)
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.value;
            }
            return null;
        })
        .catch(() => {
            return null;
        });
}

modelApi.updateValue = async (value) => {
    return await api.post("/model/value/update", value)
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });
}

modelApi.isUser = async (modelId) => {
    return await api.get("/model/is/user", {
        params: {
            modelId: modelId
        }
    })
        .then((res) => {
            if (res.data.code === 200) {
                return res.data.is
            } else {
                return false
            }
        })
        .catch(() => {
            return false
        })
}

modelApi.deleteValue = async (id) => {
    return await api.delete("/model/value/delete", {
        params: {
            id: id
        }
    })
        .then((res) => {
            return res.data.code === 200;
        })
        .catch(() => {
            return false;
        });
}
export default modelApi;