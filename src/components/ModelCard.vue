<script setup>

import {ref} from "vue";
import modelApi from "@/axios/modelApi.js";
import objectApi from "@/axios/objectApi.js";

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    editable: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['refresh', 'delete', 'edit'])
const model = ref({id: 0, name: '', infos: []})
const properties = ref([])

const refreshModel = async () => {
    modelApi.getModelById(props.id).then(res => {
        model.value = res
    })

    await objectApi.getAllPropertiesByModel(props.id).then(res => {
        properties.value = res
    })

    for (let property of properties.value) {
        property.values = await modelApi.getAllValuesByModelAndProperty(props.id, property.id)
    }
}
const editModel = (id) => {
    emits('edit', id)
}
const deleteModel = async (id) => {
    emits('delete', model.value.id)
}
refreshModel()
</script>

<template>
    <el-card>
        <template #header>
            <el-space>
                <el-text style="font-size: 20px;">{{model.name}}</el-text>
                <el-tag
                    v-for="info in model.infos"
                    effect="dark"
                >
                    {{info.name}}
                </el-tag>
                <el-button-group size="large" v-if="props.editable">
                    <el-button type="primary" icon="Edit" @click="editModel(model.id)" link/>
                    <el-button type="danger" icon="Delete" @click="deleteModel(model.id)" link/>
                </el-button-group>
            </el-space>
        </template>
        <el-descriptions :column="1">
            <el-descriptions-item
                v-for="property in properties"
                :key="property.id"
                :name="property.key"
                :label="property.key"
            >
                <el-space>
                    <el-text
                        v-for="value in property.values"
                        :key="value.id"
                    >
                        {{ property.type === 'Object' ? (value.ref ? value.ref.name: '') : value.content }}
                    </el-text>
                </el-space>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>
</template>

<style scoped>

</style>