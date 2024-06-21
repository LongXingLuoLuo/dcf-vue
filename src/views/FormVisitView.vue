<script setup>
import {ref} from "vue";
import useUserStore from "@/stores/user.js";
import formApi from "@/axios/formApi.js";
import itemApi from "@/axios/itemApi.js";
import answerApi from "@/axios/answerApi.js";
import {visitUrl} from "@/utils/formUtil.js";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import DcfItemShow from "@/components/DcfItemShow.vue";
import modelApi from "@/axios/modelApi.js";

const props = defineProps(['id']);
const userStore = useUserStore();

const form = ref({id: 0, title: '', description: ''});
const items = ref([{id: 0, type: '', label: ''}]);
const manager = ref({});
const answers = ref({});
const autoAnswers = ref({})
const router = useRouter();

const nonVisitableDialogVisible = ref(false)

const nonVisitableDialogHandleClose = () => {
    nonVisitableDialogVisible.value = false
    router.push({name: 'home'})
}

const getAutoAnswersByUserAndProperty = async (item, userId) => {
    if (item.ref) {
        await modelApi.getAllValuesByModelAndProperty(userId, item.ref.id)
            .then(res => {
                const answers = []
                res.forEach(value => {
                    answers.push({id: value.id , content: value.content, ref: value.ref})
                })
                autoAnswers.value[item.id] = answers
            })
    }
}

const getAnswerByUserAndItem = async (userId, item) => {
    const itemId = item.id
    return await answerApi.getAllAnswersByUserIdAndItemId(userId, itemId)
        .then(res => {
            answers.value[itemId] = res;
        })
        .catch(err => {
            ElMessage.error(err)
        })
}

const saveAnswer = async (item, answer, saveValue=false) => {
    ElMessage.info('保存答案')
    const itemId = item.id;
    answer['formItem'] = {id: itemId}
    answer['user'] = {id: userStore.user.id}
    if (answer.content === null && !answer.ref) {
        ElMessage.error('请填写答案')
        return
    }
    const res = await answerApi.saveAnswer(answer)
    if (res) {
        ElMessage.success('保存成功')
        answers.value[itemId].push(res)
    } else {
        ElMessage.error('保存失败')
    }
    if (saveValue && (!autoAnswers.value[item.id] || autoAnswers.value[item.id].length === 0 ||  item.ref.arr)) {
        await modelApi.saveValue({
            content: answer.content,
            owner: {id: userStore.user.id},
            ref: answer.ref,
            model: {id: userStore.user.id},
            info: {id: item.ref.id}
        }).then(() => {
            ElMessage.success('保存属性值成功')
        }).catch(() => {
            ElMessage.error('保存属性值失败')
        })
    }
}

const saveAutoAnswer = async (item, index) => {
    const answer = autoAnswers.value[item.id][index]
    await saveAnswer(item, answer, false)
    autoAnswers.value[item.id].splice(index, 1)
}

const deleteAnswer = async (itemId, answerId) => {
    if(await answerApi.deleteAnswer(answerId)) {
        answers.value[itemId] = answers.value[itemId].filter(answer => answer.id !== answerId)
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}

const deleteAutoAnswer = async (itemId, index) => {
    iautoAnswers.value[itemId].splice(index, 1)
}

const refresh = async () => {
    await formApi.isVisitable(props.id, userStore.user.id)
        .then(res => {
            if (!res) {
                nonVisitableDialogVisible.value = true
            } else {
                formApi.updateVisited(props.id, userStore.user.id)
            }
        })

    await formApi.getFormById(props.id)
        .then(res => {
            form.value = res
            if (!userStore.user){
                router.push({name: 'login'})
            }
        })
        .catch(err => {
            ElMessage.error(err)
        })

    await itemApi.getAllItemsByFormId(props.id)
        .then(res => {
            items.value = res
            for (const item of items.value) {
                console.log(item)
                getAnswerByUserAndItem(userStore.user.id, item)
                getAutoAnswersByUserAndProperty(item, userStore.user.id)
            }
        })
        .catch(err => {
            ElMessage.error(err)
        })

    await formApi.getManagerByFormId(props.id).then(res => {
        manager.value = res;
    });
}
refresh()
</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item>访问表单</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #content>
            <span class="text-large font-600 mr-3"> {{ form.title }} </span>
        </template>
        <el-descriptions :column="3" size="small" class="margin-top" border>
            <el-descriptions-item label="标题">
                {{ form.title }}
            </el-descriptions-item>
            <el-descriptions-item label="描述">
                {{ form.description }}
            </el-descriptions-item>
            <el-descriptions-item label="管理员">
                <el-tag>{{ manager.username }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="需要填写的对象">
                {{ form.ref ? form.ref.name : '没有限制' }}
                <el-tag v-if="form.ref" type="info">{{form.ref.type}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ (new Date(form.createTime)).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="最后修改时间">
                {{ (new Date(form.updateTime)).toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="访问链接">
                <el-link>
                    {{ visitUrl(form.id) }}
                </el-link>
            </el-descriptions-item>
        </el-descriptions>
    </el-page-header>
    <el-container>
        <el-main>
            <el-space direction="vertical">
                <dcf-item-show
                    v-for="(item, index) in items"
                    :index="index"
                    :item="item"
                    :autoAnswers="autoAnswers[item.id]"
                    :answers="answers[item.id]"
                    @save-new-answer="saveAnswer(item, $event.answer, true)"
                    @save-auto-answer="saveAutoAnswer(item, $event.index)"
                    @deleteAnswer="deleteAnswer(item.id, $event.id)"
                    @delete-auto-answer="deleteAutoAnswer(item.id, $event)"
                />
            </el-space>
        </el-main>
    </el-container>
    <el-dialog
        v-model="nonVisitableDialogVisible"
        destroy-on-close
        @close="nonVisitableDialogHandleClose"
    >
        <template #header>
            <el-icon icon="WarnTriangleFilled" />
            <span>不可访问</span>
        </template>
        <template #default>
            <p>{{ form.title }} 限制 {{ form.ref ? form.ref.name : '没有限制' }}，该用户不可访问</p>
        </template>
        <template #footer>
            <el-button type="primary" @click="nonVisitableDialogHandleClose">确 定</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>

</style>