<script setup>

import {ref} from "vue";
import authApi from "@/axios/authApi.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";


const username = ref('')
const password = ref('')
const handleIconClick = (node, e) => {
    node.props.suffixIcon = node.props.suffixIcon === 'eye' ? 'eyeClosed' : 'eye'
    node.props.type = node.props.type === 'password' ? 'text' : 'password'
}
const submitHandler = async () => {
    authApi.register(username.value, password.value)
        .then(res => {
            if (res === 200) {
                ElMessage.success('注册成功')
                router.push({name: 'login'})
            } else {
                ElMessage.error(res)
            }
        })
        .catch(() => {
            ElMessage.error('注册失败')
        })
}
</script>

<template>
    <FormKit type="form" label="注册账号" :actions="false" @submit="submitHandler">
        <FormKit label="请输入用户名" v-model="username" placeholder="请输入用户名"/>
        <FormKit
            name="password"
            type="password"
            label="请输入密码"
            placeholder="请输入密码"
            v-model="password"
            prefix-icon="password"
            suffix-icon="eyeClosed"
            @suffix-icon-click="handleIconClick"
            maxlength="20"
            minlength="6"
            validation="required"
            validation-visibility="live"
        />
        <FormKit
            name="password_confirm"
            type="password"
            label="请重新输入密码"
            placeholder="请重新输入密码"
            prefix-icon="password"
            suffix-icon="eyeClosed"
            @suffix-icon-click="handleIconClick"
            validation="required|confirm:password"
            validation-visibility="live"
        />
        <FormKit type="submit" suffix-icon="submit">注册</FormKit>
        <FormKit type="button" suffix-icon="bnb" @click="router.push({name:'login'})">返回登录界面</FormKit>
    </FormKit>
</template>

<style scoped>

</style>