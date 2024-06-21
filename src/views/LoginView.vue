<script setup>
import {ref} from "vue";
import authApi from "@/axios/authApi.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const username = ref();
const password = ref();
const submitHandler = async () => {
    await authApi.login(username.value, password.value)
        .then(res => {
            if (res === 200) {
                ElMessage.success("登录成功");
            } else {
                ElMessage.warning("登录失败");
            }
        }).catch(err => {
            console.log(err);
        })
}
</script>

<template>
    <FormKit
        type="form"
        submit-label="登录"
        :actions="false"
        @submit="submitHandler"
    >
        <FormKit type="text" label="用户名" name="username" v-model="username"/>
        <FormKit type="password" label="密码" name="password" v-model="password"/>
        <FormKit type="submit" suffix-icon="submit">登录</FormKit>
        <FormKit type="button" suffix-icon="bnb" @click="router.push({name:'register'})">注册</FormKit>
    </FormKit>
</template>

<style scoped>

</style>