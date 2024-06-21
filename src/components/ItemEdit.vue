<script setup>
import {ref} from "vue";
import objectApi from "@/axios/objectApi.js";

const props = defineProps(['item']);
const item = ref(props.item)
const objects = ref([])

const appendOption = () => {
    if (!item.value.options) {
        item.value.options = []
    }
    item.value.options.push('选项')
}

const removeOption = (index) => {
    if (!item.value.options) {
        item.value.options = []
        return
    }
    item.value.options = item.value.options.filter((item, i) => i !== index)
}

objectApi.getAllObjects().then(res => {
    objects.value = res.data
})
</script>

<template>
    <el-form>
        <el-tabs>
            <el-tab-pane label="基础属性">
                <el-form-item label="采集项标题">
                    <el-input type="text" v-model="item.label"/>
                </el-form-item>
                <el-form-item label="采集项类型">
                    <el-input type="text" v-model="item.type" disabled/>
                </el-form-item>
                <el-form-item label="采集项描述" v-if="item.object">
                    <el-text>{{item.object.name}}</el-text>
                </el-form-item>
                <el-form-item label="绑定的属性" v-if="item.ref">
                    <el-input v-model="item.ref.key" disabled/>
                </el-form-item>
                <el-form-item label="是否多填">
                    <el-checkbox v-if="item.ref" v-model="item.ref.arr" disabled/>
                    <el-checkbox v-else v-model="item.multiple"/>
                </el-form-item>
                <el-form-item label="格式" v-if="item.ref">
                    <el-input type="text" v-model="item.formatter" placeholder="变量为 answer"/>
                </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="选项" v-if="['select', 'radio'].includes(item.type)">
                <el-form-item label="添加新的选项">
                    <el-button @click="appendOption()">添加选项</el-button>
                </el-form-item>
                <el-form-item v-if="item.options === null || !item.options" label="选项">
                    <el-empty description="暂无选项"/>
                </el-form-item>
                <el-form-item v-for="(option, index) in item.options" :key="index" label="选项">
                    <el-input type="text" v-model="item.options[index]">
                        <template #suffix>
                            <el-button type="danger" @click="removeOption(index)" icon="Delete" round link/>
                        </template>
                    </el-input>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</template>

<style scoped>

</style>