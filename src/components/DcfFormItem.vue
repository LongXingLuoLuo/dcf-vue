<script setup>
import {computed, ref} from "vue";
import modelApi from "@/axios/modelApi.js";
import {ElMessage} from "element-plus";
import ModelCard from "@/components/ModelCard.vue";

const props = defineProps({
    'item': {
        required: true
    },
    'show': {
        type: Boolean,
        required: false,
        default: false
    },
    'submit': {
        type: Boolean,
        required: false,
        default: false
    },
    'remove': {
        type: Boolean,
        required: false,
        default: false
    },
    'update': {
        type: Boolean,
        required: false,
        default: false
    },
    'submitVisible': {
        type: Boolean,
        required: false,
        default: false
    }
})

const emits = defineEmits(['submit', 'update', 'remove'])

const item = computed(() => props.item)
const allowSubmit = computed(() => props.submit)
const allowRemove = computed(() => props.remove)
const allowUpdate = computed(() => props.update)
const onlyShow = computed(() => props.show)
const answer = defineModel({default: {id: 0, content: null, ref: {}}})
const models = ref([])
const submitVisible = ref(props.submitVisible)

const loading = ref(false)
const queryByNameLike = async (name) => {
    if (!item.value.object) {
        ElMessage.info(`查询失败，未绑定对象 ${item.value.object}`)
        return
    }
    loading.value = true
    await modelApi.getAllByInfosContainsAndNameLike(item.value.object.id, name)
        .then(res => {
            models.value = res
            loading.value = false
        })
        .catch(() => {
            loading.value = false
            return []
        })
}

const submitHandler = () => {
    emits('submit', answer.value)
    answer.value = {id: 0, content: null, ref: {}}
    submitVisible.value = false;
}

const updateHandler = () => {
    emits('update', answer.value)
    submitVisible.value = false;
}

const formatter = computed(() => (answer) => {
    try {
        if (item.value.formatter) {
            return new Function('answer', `return ${item.value.formatter}`)(answer);
        } else {
            if (answer.ref) {
                return answer.ref.name
            } else {
                return answer.content
            }
        }
    } catch (e) {
        ElMessage.error('格式化失败')
        if (answer.ref) {
            return answer.ref.name
        } else {
            return answer.content
        }
    }
})
</script>

<template>
    <el-row style="width: 400px">
        <el-col :span="18">
            <template v-if="onlyShow">
                <el-collapse v-if="answer.ref">
                    <el-collapse-item :title="formatter(answer)">
                        <model-card style="width: auto" :id="answer.ref.id" :editable="false"/>
                    </el-collapse-item>
                </el-collapse>
                <el-text v-else> {{formatter(answer)}} </el-text>
            </template>
            <el-input
                type="text"
                style="width: 100%"
                v-else-if="item.type === 'text'"
                @change="submitVisible = true"
                v-model="answer.content"
            />
            <el-input
                type="number"
                style="width: 100%"
                v-else-if="item.type === 'number'"
                @change="submitVisible = true"
                v-model="answer.content"
            />
            <el-date-picker
                type="date"
                style="width: 100%"
                v-else-if="item.type === 'date'"
                @change="submitVisible = true"
                v-model="answer.content"
            />
            <el-select
                type="select"
                style="width: 100%"
                @change="submitVisible = true"
                v-else-if="item.type === 'select'"
            >
                <el-option
                    v-for="option in item.options"
                    :label="option"
                    :value="option"
                />
            </el-select>
            <el-checkbox
                style="width: 100%"
                @change="submitVisible = true"
                v-else-if="item.type === 'checkbox'"
            />
            <el-radio-group
                style="width: 100%"
                v-else-if="item.type === 'radio'"
                @change="submitVisible = true"
            >
                <el-radio
                    v-for="option in item.options"
                    :label="option"
                    :value="option"
                />
            </el-radio-group>
            <el-select
                style="width: 100%"
                v-else-if="item.object"
                :remote-method="queryByNameLike"
                @change="submitVisible = !(!item.object)"
                @clear="submitVisible = false"
                v-model="answer.ref"
                value-key="id"
                :loading="loading"
                filterable
                remote
                clearable
            >
                <el-option
                    v-for="model in models"
                    :key="model.id"
                    :label="model.name"
                    :value="model"
                >
                    {{ model.name }}
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
            <el-button
                v-if="allowUpdate && submitVisible"
                type="success"
                :disabled="!submitVisible"
                @click="updateHandler"
                icon="CirclePlus"
                link
            >
                更新
            </el-button>
            <el-button
                v-if="allowSubmit && submitVisible"
                type="primary"
                :disabled="!submitVisible"
                @click="submitHandler"
                icon="CirclePlus"
                link
            >
                提交
            </el-button>
            <el-button
                v-if="allowRemove"
                type="danger"
                @click="emits('remove')"
                icon="Delete"
                link>
                删除
            </el-button>
        </el-col>
    </el-row>
</template>

<style scoped>

</style>