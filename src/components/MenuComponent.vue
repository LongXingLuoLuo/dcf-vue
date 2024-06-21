<script setup>
import useUserStore from "@/stores/user.js";
import authApi from "@/axios/authApi.js";
import useTokenStore from "@/stores/token.js";
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import formApi from "@/axios/formApi.js";

const userStore = useUserStore();
const isAdmin = computed(() => {
    return userStore.user && userStore.user.roles.some(role => role.name === 'admin')
})
const isUser = computed(() => {
    return userStore.user && userStore.user.roles.some(role => role.name === 'user')
})
const activeIndex = ref('1')
const nonVisitFormsCount = ref(0)
const logout = async () => {
    await authApi.logout()
        .then(res => {
            if (res) {
                const tokenStore = useTokenStore();
                tokenStore.setToken('');
                userStore.setUser(null);
                ElMessage.success("退出登录成功");
            } else {
                ElMessage.error("退出登录失败");
            }
        }).catch(() => {
            ElMessage.error("退出登录失败");
        })
}
userStore.updateUser()
if (userStore.user) {
    formApi.countAllNonVisitedForms(userStore.user.id).then(res => {
        nonVisitFormsCount.value = res
    })
}
</script>

<template>
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        router
    >
        <el-sub-menu index="user" v-if="userStore.user">
            <template #title>
                <el-space>
                    <el-avatar shape="square" size="default" icon="UserFilled"/>
                    <el-badge :value="nonVisitFormsCount" :show-zero="false">
                        <div style="line-height: 32px">{{ userStore.user.username }}</div>
                    </el-badge>
                </el-space>
            </template>
            <el-menu-item index="logout" :route="router.resolve({name: 'login'})" @click="logout">退出登录</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="user-null" v-else>
            <template #title>用户</template>
            <el-menu-item index="login" :route="router.resolve({name: 'login'})">登录</el-menu-item>
            <el-menu-item index="register" :route="router.resolve({name: 'register'})">注册</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="home" :route="router.resolve({name: 'home'})">首页</el-menu-item>
        <el-sub-menu index="form">
            <template #title>表单管理</template>
            <el-menu-item index="form-manage" :route="router.resolve({name: 'formManage'})"> 创建表单管理 </el-menu-item>
            <el-menu-item index="form-visitable" :route="router.resolve({name: 'formVisitable'})"> 可访问表单查看 </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="object-manage" :route="router.resolve({name: 'objectManage'})"> 对象管理 </el-menu-item>
        <el-menu-item index="model-manage" :route="router.resolve({name: 'modelManage'})"> 模型管理 </el-menu-item>
        <el-menu-item index="user-manage" v-if="isAdmin" :route="router.resolve({name: 'userManage'})"> 用户管理 </el-menu-item>
    </el-menu>
</template>

<style scoped>
.item {
    margin-top: 10px;
    margin-right: 30px;
}
</style>