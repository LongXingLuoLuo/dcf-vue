<script setup>

import {ref} from "vue";
import modelApi from "@/axios/modelApi.js";

const props = defineProps({
    value: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['submit', 'cancel'])
const loading = ref(false)
const value = ref(props.value)
const models = ref([])
const queryByInfosContainsAndNameLike = async (name) => {
    return await modelApi.getAllByInfosContainsAndNameLike(value.value.info.ref.id, name)
        .then(res => {
            models.value = res
        })
        .catch(() => {
            return []
        })
}
const submitHandler = () => {
    emits('submit', value.value)
}

const cancelHandler = () => {
    emits('cancel')
}
</script>

<template>
    <el-form

    >
        <el-form-item
            label="内容"
            @keyup.enter.down="emits('submit', value)"
        >
            <el-input
                type="text"
                v-if="value.info.type === 'String'"
                v-model="value.content"
            />
            <el-input
                type="number"
                v-else-if="value.info.type === 'Integer'"
                v-model="value.content"
            />
            <el-checkbox
                v-else-if="value.info.type === 'Boolean'"
                v-model="value.content"
            />
            <el-date-picker
                v-else-if="value.info.type === 'Date'"
                type="date"
                v-model="value.content"
            />

            <el-select
                v-else-if="value.info.type === 'Object'"
                filterable
                remote
                :remote-method="queryByInfosContainsAndNameLike"
                :loading="loading"
                value-key="id"
                v-model="value.ref"
            >
                <el-option
                    v-for="model in models"
                    :key="model.id"
                    :label="model.name"
                    :value="model"
                    :disabled="value.info.values ? value.info.values.some(v => v.ref.id === model.id) : false"
                />
            </el-select>
        </el-form-item>
    </el-form>
</template>

<style scoped>

</style>