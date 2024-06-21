<script setup>

import {computed, ref} from "vue";
import objectApi from "@/axios/objectApi.js";

const props = defineProps(['property']);
const property = computed({
    get: () => {
        return props.property
    },
    set: (value) => {
        props.property = value
    }
});

const typeChange = () => {
    if (property.value.type === 'Object') {
        property.value.ref = {}
    } else {
        property.value.ref = null
    }
}

const objects = ref([]);
objectApi.getAllObjects().then(res => {
    objects.value = res;
});
</script>

<template>
    <el-form>
        <el-tabs>
            <el-tab-pane label="基础属性">
                <el-form-item label="ID">
                    <el-input type="text" v-model="property.id" disabled/>
                </el-form-item>
                <el-form-item label="键名称">
                    <el-input type="text" v-model="property.key"/>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select @change="typeChange" v-model="property.type">
                        <el-option label="String" value="String"/>
                        <el-option label="Number" value="Number"/>
                        <el-option  label="Boolean" value="Boolean"/>
                        <el-option label="Date" value="Date"/>
                        <el-option label="Object" value="Object"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为数组">
                    <el-checkbox v-model="property.arr"/>
                </el-form-item>
                <el-form-item v-if="property.type === 'Object'">
                    <el-select
                        v-model="property.ref"
                        value-key="id"
                    >
                        <el-option v-for="item in objects" :key="item.id" :label="item.name" :value="item">
                            <span style="float: left">{{item.name}}</span>
                            <span style="float: right"><el-tag type="info" effect="light">{{item.type}}</el-tag></span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</template>

<style scoped>

</style>