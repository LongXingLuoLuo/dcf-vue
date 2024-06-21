<script setup>
import {RouterView} from 'vue-router'
import MenuComponent from "@/components/MenuComponent.vue";
</script>

<template>
    <el-container>
        <el-header>
            <MenuComponent/>
        </el-header>
        <el-main>
            <RouterView/>
        </el-main>
    </el-container>
</template>

<style scoped>
</style>
