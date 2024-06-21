<script setup>
import {computed, ref} from "vue";
import itemApi from "@/axios/itemApi.js";
import formApi from "@/axios/formApi.js";

import {useRouter} from "vue-router";
import ItemEdit from "@/components/ItemEdit.vue";
import {ElMessage} from "element-plus";
import {visitHref, visitUrl} from "@/utils/formUtil.js";
import objectApi from "@/axios/objectApi.js";
import FormItemInput from "@/components/DcfItemShow.vue";

const props = defineProps(['id']);
const types = ['text', 'number', 'date', 'select', 'checkbox', 'radio'];

const form = ref({id: 0, title: '', description: '', manager: {}});
const items = ref([{id: 0, type: '', label: '', required: false, options: []}]);
const manager = computed(() => form.value.manager);
const objects = ref();
const properties = ref([]);

const selectItemIndex = ref(0);
const router = useRouter();

const dialogVisible = ref(false)
const itemAddVisible = ref(false)

const editItem = (index) => {
    selectItemIndex.value = index
    dialogVisible.value = true;
}

const dialogConfirm = () => {
    dialogVisible.value = false;
    updateItem(items.value[selectItemIndex.value])
}

const addBasicItem = async (formId, type) => {
    const item = await itemApi.saveFormItem({
        label: "采集项",
        type: type,
        multiple: false,
        form: {
            id: formId
        }
    });
    if (item) {
        items.value.push(item)
        items.value.sort((a, b) => a.order - b.order)
        ElMessage.success('添加新的采集项成功')
        itemAddVisible.value = false;
    } else {
        ElMessage.error('添加新的采集项失败')
    }
}

const addPropertyItem = async (formId, ref) => {
    let type;
    switch (ref.type) {
        case 'String': type = 'text'; break;
        case 'Number': type = 'number'; break;
        case 'Date': type = 'date'; break;
        case 'Boolean': type = 'checkbox'; break;
        case 'Object': type = 'object'; break;
        default: type = 'text'; break;
    }
    let multiple = ref.arr;
    const item = await itemApi.saveFormItem({
        label: ref.key,
        type: type,
        multiple: multiple,
        object: {
            id: ref.ref ? ref.ref.id: null
        },
        ref: {
            id: ref.id
        },
        form: {
            id: formId
        }
    });
    if (item) {
        items.value.push(item)
        items.value.sort((a, b) => a.order - b.order)
        ElMessage.success('添加新的采集项成功')
        itemAddVisible.value = false;
    } else {
        ElMessage.error('添加新的采集项失败')
    }
}

const addObjectItem = async (formId, object) => {
    const item = await itemApi.saveFormItem({
        label: object.name,
        type: 'object',
        multiple: false,
        object: {
            id: object.id
        },
        form: {
            id: formId
        }
    });
    if (item) {
        items.value.push(item)
        items.value.sort((a, b) => a.order - b.order)
        ElMessage.success('添加新的采集项成功')
        itemAddVisible.value = false;
    } else {
        ElMessage.error('添加新的采集项失败')
    }
}

const deleteItem = async (itemId) => {
    if (await itemApi.deleteItem(itemId)) {
        items.value = items.value.filter(item => item.id !== itemId)
        ElMessage.success('删除采集项成功')
    } else {
        ElMessage.error('删除采集项失败')
    }
}

const updateForm = async (form) => {
    if (await formApi.updateForm(form)) {
        ElMessage.success('更新表单成功')
    } else {
        ElMessage.error('更新表单失败')
    }
}

const updateRef = async () => {
    if (!form.value.ref) {
        await formApi.updateRef(form.value.id, -1)
            .then(res => {
                if (res) {
                    properties.value = []
                    ElMessage.success('更新表单成功.')
                } else {
                    ElMessage.error('更新表单失败.')
                }
            })
    } else {
        await formApi.updateRef(form.value.id, form.value.ref.id)
            .then(res => {
                if (res) {
                    refreshProperties(form.value.ref.id)
                    ElMessage.success('更新表单成功.')
                } else {
                    ElMessage.error('更新表单失败.')
                }
            })
    }
}

const updateItem = async (item) => {
    if (await itemApi.updateItem(item)) {
        ElMessage.success('更新采集项成功')
    } else {
        ElMessage.error('更新采集项失败')
    }
}

const refreshForm = async () => {
    formApi.getFormById(props.id).then(res => {
        form.value = res;
        if (res.ref) {
            refreshProperties(res.ref.id)
        }
    });

    itemApi.getAllItemsByFormId(props.id).then(res => {
        items.value = res;
        items.value.sort((a, b) => a.order - b.order)
    });

    objectApi.getAllObjects().then(res => {
        objects.value = res;
    });
}

const refreshProperties = async (objectId) => {
    await objectApi.getAllPropertiesByObject(objectId).then(res => {
        properties.value = res;
    });
}
refreshForm()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'formManage'}">表单管理</el-breadcrumb-item>
                <el-breadcrumb-item> 表单编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #content>
            <span class="text-large font-600 mr-3"> {{ form.title }} </span>
        </template>
        <template #extra>
            <el-space v-if="itemAddVisible" @blur="itemAddVisible = false">
                <el-form-item label="新采集项类型">
                    <el-select style="width: 150px">
                        <el-option-group label="基础采集项">
                            <el-option
                                :label="type"
                                :value="type"
                                v-for="type in types"
                                @click="addBasicItem(form.id, type)"
                            />
                        </el-option-group>
                        <el-option-group label="关联属性">
                            <el-option
                                :label="property.key"
                                :value="property"
                                v-for="property in properties"
                                @click="addPropertyItem(form.id, property)"
                            >
                                <el-space>
                                    <span>{{ property.key }}</span>
                                    <el-tag type="info" effect="plain" v-if="property.ref">{{ property.ref.type }}</el-tag>
                                    <el-tag type="primary" effect="plain" v-else>{{ property.type }}</el-tag>
                                </el-space>
                            </el-option>
                        </el-option-group>
                        <el-option-group label="引用对象">
                            <el-option
                                :label="object.name"
                                :value="object"
                                v-for="object in objects"
                                @click="addObjectItem(form.id, object)"
                            >
                                <el-space>
                                    <span>{{ object.name }}</span>
                                    <el-tag type="info" effect="plain">{{ object.type }}</el-tag>
                                </el-space>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
            </el-space>
            <el-form-item v-else>
                <el-button type="primary" icon="Plus" @click="itemAddVisible = true">
                    添加新采集项
                </el-button>
            </el-form-item>
        </template>
        <el-descriptions :column="1" size="small" class="margin-top" border>
            <el-descriptions-item label="标题">
                <el-input type="text" @change="updateForm(form)" v-model="form.title"/>
            </el-descriptions-item>
            <el-descriptions-item label="描述">
                <el-input type="text" @change="updateForm(form)" v-model="form.description"/>
            </el-descriptions-item>
            <el-descriptions-item label="管理员">
                <el-tag>{{ manager.username }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="需要填写的对象">
                <el-select
                    clearable
                    @change="updateRef()"
                    v-model="form.ref"
                    value-key="id"
                    style="width: 300px">
                    <el-option
                        v-for="object in objects"
                        :label="object.name"
                        :key="object.id"
                        :value="object"
                    >
                        {{ object.name }}
                        <el-tag type="info" effect="plain">{{ object.type }}</el-tag>
                    </el-option>
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ form.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="访问链接">
                <el-link :href="visitHref(form.id)">
                    {{ visitUrl(form.id) }}
                </el-link>
            </el-descriptions-item>
        </el-descriptions>
    </el-page-header>

    <el-container>
        <el-main>
            <form-item-input
                v-for="(item, index) in items"
                :key="item.id"
                :item="item"
                :index="index"
                :editable="true"
                @delete-item="deleteItem(item.id)"
                @edit-item="editItem(index)"
            />
        </el-main>
    </el-container>
    <el-dialog
        v-model="dialogVisible"
        title="编辑采集项"
        width="500"
        destroy-on-close
        :before-close="dialogConfirm"
    >
        <ItemEdit :item="items[selectItemIndex]"/>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="dialogConfirm">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>