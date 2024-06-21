<script setup>

import {ref} from "vue";
import objectApi from "@/axios/objectApi.js";
import ObjectEdit from "@/components/ObjectEdit.vue";
import {ElMessage} from "element-plus";
import PropertyEdit from "@/components/PropertyEdit.vue";

const props = defineProps(["id", "editable"])
const emits = defineEmits(["delete", "update", "refresh", "add-property", "remove-property"])
const object = ref({})
const properties = ref([])
const selectedPropertyIndex = ref(-1)
const objectEditDialogVisible = ref(false)
const propertyEditDialogVisible = ref(false)

const refreshObject = () => {
    objectApi.getObjectById(props.id)
        .then(res => {
            object.value = res
        })
        .catch(() => {
            object.value = null
        });
    objectApi.getAllPropertiesByObject(props.id)
        .then(res => {
            properties.value = res
        })
        .catch(() => {
            properties.value = []
        });
}

const updateObject = async (object) => {
    if (!(await objectApi.updateObject(object))) {
        ElMessage.error("更新 object " + object.name + " 失败")
        return
    }
    ElMessage.success("更新 object " + object.name)
}

const deleteObject = (id) => {
    if (!objectApi.deleteObject(id)) {
        ElMessage.error("删除 object " + id + " 失败")
        return
    }
    ElMessage.success("删除 object " + id + "成功")
    emits("delete", id)
}

const editProperty = (index) => {
    selectedPropertyIndex.value = index
    propertyEditDialogVisible.value = true
}

const updateProperty = async (property) => {
    if (!(await objectApi.updateProperty(property))) {
        ElMessage.error("更新属性失败")
        return
    }
    ElMessage.success("更新属性成功")
}

const addNewProperty = async (objectId) => {
    const property = await objectApi.saveProperty({
        key: "新属性",
        type: "String",
        arr: false
    });
    if (property === null) {
        ElMessage.error("添加属性失败")
        return
    }
    await addProperty(objectId, property.id)
}

const addProperty = async (objectId, propertyId) => {
    await objectApi.addProperty(objectId, propertyId)
        .then(() => {
            emits("add-property", objectId, propertyId)
            refreshObject()
        })
        .catch(() => {
            ElMessage.error("添加属性失败")
        })
}

const removeProperty = (objectId, propertyId) => {
    objectApi.removeProperty(objectId, propertyId)
        .then(() => {
            emits("remove-property", objectId, propertyId)
            properties.value = properties.value.filter(property => property.id !== propertyId)
            // ElMessage.success("移除属性成功")
        })
        .catch(() => {
            ElMessage.error("删除属性失败")
        })
}

const objectEditDialogHandleClose = () => {
    updateObject(object.value)
    objectEditDialogVisible.value = false
}

const propertyEditDialogHandleClose = () => {
    console.log(selectedPropertyIndex.value)
    updateProperty(properties.value[selectedPropertyIndex.value])
    propertyEditDialogVisible.value = false
}
refreshObject()
</script>

<template>
    <el-empty v-if="object === null" description="暂无数据"/>
    <el-card style="max-width: max-content;" shadow="always">
        <template #header>
            <el-space>
                <el-text style="font-size: 20px;">{{object.name}}</el-text>
                <el-tag  effect="dark" type="info">{{object.type}}</el-tag>
                <el-button type="primary" @click="objectEditDialogVisible = true" icon="Edit" link/>
                <el-button type="danger" @click="deleteObject(object.id)" icon="Delete" link/>
            </el-space>
        </template>
        <el-descriptions title="属性" border :column="1">
            <template v-if="props.editable" #extra>
                <el-button type="primary" size="small" @click="addNewProperty(object.id)" icon="Plus">添加属性</el-button>
            </template>
            <el-descriptions-item v-for="(property, index) in properties">
                <template #label>
                    <el-space>
                        <el-text>{{property.key}}</el-text>
                        <el-button type="primary" v-if="props.editable" @click="editProperty(index)" icon="Edit" link/>
                        <el-button type="danger" v-if="props.editable" @click="removeProperty(object.id, property.id)" icon="Delete" link/>
                    </el-space>
                </template>
                <el-space>
                    <el-tag type="info" effect="dark" v-if="property.ref">{{property.ref.type}}</el-tag>
                    <el-tag type="primary" effect="dark" v-else>{{property.type}}</el-tag>
                </el-space>
            </el-descriptions-item>
        </el-descriptions>
    </el-card>
    <el-dialog
        v-model="objectEditDialogVisible"
        :title="`编辑 ${object.name}`"
        width="500"
        destroy-on-close
        :before-close="objectEditDialogHandleClose"
    >
        <object-edit :object="object"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="objectEditDialogHandleClose">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="propertyEditDialogVisible"
        :title="`编辑 ${properties[selectedPropertyIndex] ? properties[selectedPropertyIndex].key : ''}`"
        width="500"
        destroy-on-close
        :before-close="propertyEditDialogHandleClose"
    >
        <property-edit :property="properties[selectedPropertyIndex]" v-if="properties[selectedPropertyIndex]"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="propertyEditDialogHandleClose">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>