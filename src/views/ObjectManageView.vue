<script setup>
import objectApi from "@/axios/objectApi.js";
import {ElMessage} from "element-plus";
import {ref} from "vue";
import ObjectCard from "@/components/ObjectCard.vue";
import router from "@/router/index.js";
const objects = ref([])
const refreshObjects = () => {
    objectApi.getAllObjects()
        .then(res => {
            objects.value = res
        })
        .catch(() => {
            ElMessage.error("获取 modelObject 失败");
        })
}
const addObject = (name, type) => {
    objectApi.saveObject(name, type)
        .then((res) => {
            objects.value.push(res)
        })
        .catch(() => {
            ElMessage.error("添加 object " + name + " 失败")
        })
}
const deleteObject = (id) => {
    objects.value = objects.value.filter(object => object.id !== id)
}
refreshObjects()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'objectManage'}">对象管理</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #extra>
            <el-button type="primary" icon="Refresh" @click="refreshObjects">刷新</el-button>
            <el-button type="primary" icon="Plus" @click="addObject('新建对象', 'Object')">新建对象</el-button>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <el-space wrap>
                <object-card v-for="object in objects" :key="object.id" :id="object.id" :editable="true" @delete="deleteObject"/>
            </el-space>
        </el-main>
    </el-container>
</template>
<style scoped>

</style>