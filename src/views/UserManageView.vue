<script setup>

import userApi from "@/axios/userApi.js";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";

const users = ref([]);
const router = useRouter()
const loading = ref(false)
const  isAdmin = computed(() => (user) => {
    return user && user.roles.some(role => role.name === 'admin')
})
const refreshUsers = async () => {
    users.value = await userApi.getAllUsers();
}
const setAdmin = async (id) => {
    await userApi.setAdmin(id)
        .then(res => {
            if (res) {
                refreshUsers()
            }
        })
}
refreshUsers()
</script>

<template>
    <el-page-header>
        <template #content>
            <span class="font-600 font-bold">用户管理</span>
        </template>
        <template #breadcrumb>
            <el-breadcrumb>
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <el-table :data="users" v-loading="loading">
                <el-table-column prop="id" label="用户 id"/>
                <el-table-column prop="username" label="用户名"/>
                <el-table-column label="角色">
                    <template #default="{row}">
                        <el-space>
                            <el-tag v-for="role in row.roles" :key="role.id">{{ role.name }}</el-tag>
                        </el-space>
                    </template>
                </el-table-column>
                <el-table-column label="身份">
                    <template #default="{row}">
                        <el-space>
                            <el-tag v-for="info in row.infos" :key="info.id">{{ info.name }}</el-tag>
                        </el-space>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template #header>
                        <el-button type="info" size="small" icon="Refresh" @click="refreshUsers">刷新</el-button>
                    </template>
                    <template #default="{row}">
                        <el-button-group>
                            <el-button type="primary" icon="Edit" size="small" @click="router.push({name: 'modelEdit', params: {id: row.id}})">编辑</el-button>
                            <el-button type="danger" icon="Star" size="small" @click="setAdmin(row.id)" :disabled="isAdmin(row)">设为管理员</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<style scoped>

</style>