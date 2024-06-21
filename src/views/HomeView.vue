<script setup>
import useUserStore from "@/stores/user.js";
import {useRouter} from "vue-router";
import {ref} from "vue";
import modelApi from "@/axios/modelApi.js";
import objectApi from "@/axios/objectApi.js";
import htmlToPdf from "@/utils/htmlToPdf.js";

const userStore = useUserStore();
const router = useRouter();
const model = ref({id: 0, name: '', infos: []})
const objects = ref([])
const properties = ref([])

const refreshModel = async () => {
    modelApi.getModelById(userStore.user.id).then(res => {
        model.value = res
    })

    objectApi.getAllObjects().then(res => {
        objects.value = res
    })

    await objectApi.getAllPropertiesByModel(userStore.user.id).then(res => {
        properties.value = res
    })
    for (let property of properties.value) {
        property.values = await modelApi.getAllValuesByModelAndProperty(userStore.user.id, property.id)
    }
}

const toPdf = () => {
    htmlToPdf.getPdf(userStore.user.username);
}

if (!userStore.user) {
    router.push({name: 'login'});
} else {
    refreshModel()
}
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #extra>
            <el-button @click="router.push({name: 'modelEdit', params:{id: userStore.user.id}})"> 编辑 </el-button>
            <el-button @click="toPdf"> 打印 </el-button>
        </template>
        <template #content>
            <el-avatar v-if="userStore.user" icon="UserFilled"/> {{ userStore.user.username }}
        </template>
        <el-descriptions :column="3" border>
            <el-descriptions-item v-if="userStore.user" label="用户名">
                {{ userStore.user.username }}
            </el-descriptions-item>
            <el-descriptions-item v-if="userStore.user" label="角色">
                <el-space>
                    <el-tag v-for="role in userStore.user.roles" :key="role.id">{{ role.name }}</el-tag>
                </el-space>
            </el-descriptions-item>
        </el-descriptions>
    </el-page-header>
    <el-container id="pdfDom">
        <el-main>
            <el-form style="width: 500px">
                <el-form-item
                    v-for="property in properties"
                    :key="property.id"
                    :name="property.key"
                    :label="property.key"
                >
                    <el-space>
                        <el-tag
                            v-for="value in property.values"
                            :key="value.id"
                            effect="plain"
                            type="info"
                            size="large"
                        >
                            {{ property.type === 'Object' ? (value.ref ? value.ref.name: '') : value.content }}
                        </el-tag>
                    </el-space>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>

<style scoped>
</style>