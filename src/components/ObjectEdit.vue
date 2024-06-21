<script setup>
import {computed} from "vue";

const props = defineProps(['object']);
const object = computed({
    get: () => props.object,
    set: (value) => {
        props.object = value
    }
});
</script>

<template>
    <el-form>
        <el-tabs>
            <el-tab-pane label="基础属性">
                <el-form-item label="ID">
                    <el-input type="text" v-model="object.id" disabled/>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input type="text" v-model="object.name"/>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input type="text" v-model="object.type"/>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</template>

<style scoped>

</style>