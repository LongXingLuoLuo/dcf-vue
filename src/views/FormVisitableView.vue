<script setup>
import formApi from "@/axios/formApi.js";
import {ref} from "vue";
import {visitHref, visitUrl} from "@/utils/formUtil.js";
import {ElMessage} from "element-plus";
import useClipboard from "vue-clipboard3";
import useUserStore from "@/stores/user.js";
import {useRouter} from "vue-router";

const router = useRouter()
const userStore = useUserStore()
const {toClipboard} = useClipboard()
const visitableForms = ref([])
const loading = ref(true)

const refreshVisitableForms = async () => {
    loading.value = true
    visitableForms.value = await formApi.getAllVisitableForms(userStore.user.id);
    visitableForms.value.forEach(form => {
        formApi.existVisited(form.id, userStore.user.id)
            .then(res => {
                form.isVisited = res
            })
    })
    loading.value = false
}
const copyVisitUrl = async (id) => {
    if (await toClipboard(visitUrl(id))) {
        ElMessage({
            message: '复制成功',
            type: 'success',
        })
    }
}
refreshVisitableForms()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>可填写的表单</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #content>
            <span class="text-large font-600 mr-3"> 可填写的表单列表 </span>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <el-table
                :data="visitableForms"
                v-loading="loading"
            >
                <el-table-column label="是否已填写" width="150">
                    <template #default="scope">
                        <el-tag v-if="scope.row.isVisited" type="success">已填写</el-tag>
                        <el-tag v-else type="danger">未填写</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="标题" prop="title" width="150" fixed/>
                <el-table-column label="描述" prop="description" width="150"/>
                <el-table-column label="需要填写的对象" width="150">
                    <template #default="scope">
                        {{ scope.row.ref ? scope.row.ref.name : '没有限制' }}
                        <el-tag v-if="scope.row.ref" type="info">{{scope.row.ref.type}}</el-tag>
                    </template>
                </el-table-column>
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
                <el-table-column>
                    <template #header>
                        <el-button size="small" @click="refreshVisitableForms">
                            刷新
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<style scoped>
</style>