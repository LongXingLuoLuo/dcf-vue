<script setup>

import {ref} from "vue";
import modelApi from "@/axios/modelApi.js";
import {useRouter} from "vue-router";
import objectApi from "@/axios/objectApi.js";

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const router = useRouter();

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
                <el-input v-model="model.name" placeholder="请输入模型名称" disabled/>
            </el-descriptions-item>
            <el-descriptions-item label="模型信息">
                <el-space>
                    <el-tag
                        v-for="info in model.infos"
                        effect="dark"
                    >
                        {{ info.name }}
                    </el-tag>
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
                        >
                            {{ property.type === 'Object' ? (value.ref ? value.ref.name: '') : value.content }}
                        </el-tag>
                    </el-space>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<style scoped>

</style>