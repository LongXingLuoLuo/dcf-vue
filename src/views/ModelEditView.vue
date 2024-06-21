<script setup>

import {ref} from "vue";
import modelApi from "@/axios/modelApi.js";
import {useRouter} from "vue-router";
import objectApi from "@/axios/objectApi.js";
import {ElMessage} from "element-plus";
import ValueEdit from "@/components/ValueEdit.vue";

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const router = useRouter();
const infoAddVisible = ref(false)
const valueAddVisible = ref(false)
const newValue = ref({content: '', owner: {} ,info: {}, ref: {}})

const model = ref({id: 0, name: '', infos: []})
const objects = ref([])
const properties = ref([])

const refreshModel = async () => {
    modelApi.getModelById(props.id).then(res => {
        model.value = res
    })

    objectApi.getAllObjects().then(res => {
        objects.value = res
    })

    await objectApi.getAllPropertiesByModel(props.id).then(res => {
        properties.value = res
    })
    for (let property of properties.value) {
        property.values = await modelApi.getAllValuesByModelAndProperty(props.id, property.id)
    }
}

const updateModel = async (model) => {
    if (await modelApi.updateModel(model)) {
        ElMessage.success('更新成功')
    } else {
        ElMessage.error('更新失败')
    }
}

const addInfo = async (modelId, objectId) => {
    if (await modelApi.updateModelAddInfo(modelId, objectId)) {
        await refreshModel()
        infoAddVisible.value = false
    } else {
        ElMessage.error('添加失败')
    }
}

const removeInfo = async (modelId, infoId) => {
    if (await modelApi.updateModelRemoveInfo(modelId, infoId)) {
        await refreshModel()
    } else {
        ElMessage.error('删除失败')
    }
}

const saveValue = async (value) => {
    await modelApi.saveValue(value)
        .then(res => {
            if (res === null) {
                ElMessage.error('添加失败')
                return
            }
            properties.value.find(property => property.id === value.info.id).values.push(res)
        })
        .catch(() => {
            ElMessage.error('添加失败')
        })
}

const deleteValue = async (propertyId, valueId) => {
    if (await modelApi.deleteValue(valueId)) {
        properties.value.find(property => property.id === propertyId).values = properties.value.find(property => property.id === propertyId).values.filter(value => value.id !== valueId)
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}

const addValue = async (property) => {
    newValue.value = {content: '', owner: model.value, info: property, ref: {}}
    valueAddVisible.value = true
}

const valueAddDialogHandleConfirm = async () => {
    valueAddVisible.value = false
    await saveValue(newValue.value)
}
refreshModel()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'modelManage'}">模型管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑模型</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #extra>
            <el-button type="primary" icon="Refresh" @click="refreshModel">刷新</el-button>
        </template>
        <el-descriptions :column="1" size="small" style="height: max-content" border>
            <el-descriptions-item label="模型名称">
                <el-input v-model="model.name" @change="updateModel(model)" placeholder="请输入模型名称"/>
            </el-descriptions-item>
            <el-descriptions-item label="模型信息">
                <el-space>
                    <el-tag
                        v-for="info in model.infos"
                        effect="dark"
                        closable
                        @close="removeInfo(model.id, info.id)"
                    >
                        {{ info.name }}
                    </el-tag>
                    <el-select
                        v-if="infoAddVisible"
                        placeholder="添加信息"
                        size="small"
                        style="width: 100px"
                        @blur="infoAddVisible = false"
                    >
                        <el-option
                            v-for="object in objects"
                            :key="object.id"
                            :label="object.name"
                            :value="object.id"
                            :disabled="model.infos.some(info => info.id === object.id)"
                            @click="addInfo(model.id, object.id)"
                        />
                    </el-select>
                    <el-button
                        type="primary"
                        size="small"
                        v-else
                        @click="infoAddVisible = true"
                    >
                        添加信息
                    </el-button>
                </el-space>
            </el-descriptions-item>
        </el-descriptions>
    </el-page-header>
    <el-container>
        <el-main>
            <el-form style="width: 500px">
                <el-form-item
                    v-for="property in properties"
                    :key="property.id"
                    :name="property.key"
                    :label="property.key"
                >
                    <el-space>
                        <el-tag
                            v-for="value in property.values"
                            :key="value.id"
                            effect="plain"
                            type="info"
                            size="large"
                            @close="deleteValue(property.id, value.id)"
                            closable
                        >
                            {{ property.type === 'Object' ? (value.ref ? value.ref.name: '') : value.content }}
                        </el-tag>
                        <el-button
                            type="primary"
                            icon="CirclePlus"
                            size="large"
                            v-if="!property.values || property.values.length === 0 || property.arr"
                            @click="addValue(property)"
                            link
                        >
                            添加值
                        </el-button>
                    </el-space>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
    <el-dialog
        title="添加值"
        v-model="valueAddVisible"
        width="500"
        destroy-on-close
    >
        <value-edit :value="newValue" @submit="valueAddDialogHandleConfirm"/>
        <template #footer>
            <el-button type="primary" @click="valueAddDialogHandleConfirm">确认</el-button>
            <el-button type="primary" @click="valueAddVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>