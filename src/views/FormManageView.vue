<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router';
import formApi from "@/axios/formApi.js";
import useUserStore from "@/stores/user.js";
import {ElMessage} from "element-plus";
import {visitHref, visitUrl} from "@/utils/formUtil.js";
import useClipboard from 'vue-clipboard3'

const router = useRouter()
const userStore = useUserStore()
const {toClipboard} = useClipboard()

const loading = ref(true)

const formData = ref([{
    id: 1, title: "表单1", description: "这是表单1的描述"
}])


const addForm = () => {
    formApi.saveFormWithManagerId(userStore.user.id)
        .then(res => {
            if (res === null) {
                ElMessage({
                    message: '创建表单失败.',
                    type: 'error',
                })
            } else {
                formData.value.push(res)
            }
        })
        .catch(() => {
            ElMessage({
                message: '创建表单失败.',
                type: 'error',
            })
        })
}

const deleteForm = async (id) => {
    await formApi.deleteFormById(id)
        .then(res => {
            if (res) {
                formData.value = formData.value.filter(item => item.id !== id)
            } else {
                ElMessage({
                    message: '删除表单失败.',
                    type: 'error',
                })
            }
        })
}

const refreshForm = async () => {
    loading.value = true;

    await formApi.getAllFormsByManagerId(userStore.user.id)
        .then(res => {
            formData.value = res
        })
        .catch(() => {
            ElMessage.error('获取表单信息失败.')
        })
        .finally(() => {
            loading.value = false
        })
}

const copyVisitUrl = async (id) => {
    if (await toClipboard(visitUrl(id))) {
        ElMessage({
            message: '复制成功',
            type: 'success',
        })
    }
}

const handleEdit = (row) => {
    router.push({name: 'formEdit', params: {id: row.id}})
}
const handleDelete = (row) => {
    deleteForm(row.id)
}

refreshForm();
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>创建的表单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #content>
            <span class="text-large font-600 mr-3"> 创建的表单管理 </span>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <el-table
                :data="formData"
                v-loading="loading"
            >
                <el-table-column label="id" prop="id" width="150" fixed/>
                <el-table-column label="标题" prop="title" width="150" fixed/>
                <el-table-column label="描述" prop="description" width="150"/>
                <el-table-column label="访问链接" width="300">
                    <template #default="scope">
                        <el-space direction="horizontal">
                            <el-button type="info" icon="CopyDocument" @click="copyVisitUrl(scope.row.id)" link/>
                            <el-link :href="visitHref(scope.row.id)">
                                {{ visitUrl(scope.row.id) }}
                            </el-link>
                        </el-space>
                    </template>
                </el-table-column>
                <el-table-column label="需要填写的对象" width="150">
                    <template #default="scope">
                        {{ scope.row.ref ? scope.row.ref.name : '没有限制' }}
                        <el-tag v-if="scope.row.ref" type="info">{{scope.row.ref.type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="right">
                    <template #header>
                        <el-button size="small" @click="addForm">
                            添加新的表单
                        </el-button>
                        <el-button size="small" @click="refreshForm">
                            刷新
                        </el-button>
                    </template>
                    <template #default="scope">
                        <el-button-group>
                            <el-button size="small" type="primary" icon="Edit" @click="handleEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button size="small" type="success" icon="OfficeBuilding"
                                       @click="router.push({name: 'formAnswerManage', params: {id: scope.row.id}})">
                                后台
                            </el-button>
                            <el-button size="small" type="danger" icon="Delete" @click="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<style scoped>

</style>