<script setup>
import {ref} from 'vue';
import {useRouter} from "vue-router";
import modelApi from "@/axios/modelApi.js";
import ModelCard from "@/components/ModelCard.vue";
import {ElMessage} from "element-plus";
import objectApi from "@/axios/objectApi.js";

const models = ref([]);
const router = useRouter();
const selectedObject = ref(null);
const objects = ref([]);

const refreshModels = async () => {
    if (selectedObject.value) {
        models.value = await modelApi.getAllModelsByInfosContains(selectedObject.value.id);
    } else {
        models.value = await modelApi.getAllModels();
    }
    models.value.forEach(model => {
        modelApi.isUser(model.id).then(res => {
                model.isUser = res;
                console.log(model.isUser)
            }
        )
    })
}

const refreshObjects = async () => {
    objects.value = await objectApi.getAllObjects();
}

const saveModel = async () => {
    const model = await modelApi.saveModel({
        name: selectedObject.value ? `${selectedObject.value.name}-${models.value.length + 1}` : "新建模型",
        infos: selectedObject.value ? [{id: selectedObject.value.id}] : []
    })
    if (!model) {
        ElMessage.error("保存模型失败");
        return;
    }
    models.value.push(model);
    ElMessage.success("保存模型成功");
}

const editModel = (id) => {
    router.push({name: 'modelEdit', params: {id: id, editable: true}})
}

const deleteModel = (id) => {
    modelApi.deleteModel(id).then(() => {
        models.value = models.value.filter(model => model.id !== id);
        ElMessage.success("删除模型成功");
    })
}

refreshModels()
refreshObjects()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'modelManage'}">模型管理</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #extra>
            <el-select
                value-key="id"
                v-model="selectedObject"
                @change="refreshModels"
                placeholder="请选择对象"
                style="width: 200px;margin-right: 10px"
                clearable
                :value-on-clear="null"
            >
                <el-option
                    v-for="object in objects"
                    :key="object.id"
                    :label="object.name"
                    :value="object"
                >
                    <span>{{ object.name }}</span>
                    <el-tag size="small" type="info">{{ object.type }}</el-tag>
                </el-option>
            </el-select>
            <el-button type="primary" icon="Refresh" @click="refreshModels">刷新</el-button>
            <el-button type="primary" icon="Plus" @click="saveModel">新建模型</el-button>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <el-space wrap>
                <model-card
                    v-for="model in models"
                    :key="model.id"
                    :id="model.id"
                    :editable="!model.isUser"
                    @delete="deleteModel"
                    @edit="editModel"
                />

            </el-space>
        </el-main>
    </el-container>
</template>

<style scoped>

</style>