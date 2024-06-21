<script setup>
import {computed, ref} from "vue";
import DcfFormItem from "@/components/DcfFormItem.vue";

const props = defineProps({
    'index': {
        required: false,
        default: 0
    },
    'item': {
        required: true
    },
    'answers': {
        required: false,
        default: []
    },
    'editable': {
        required: false,
        default: false
    },
    'autoAnswers': {
        required: false,
        default: {}
    }
})
const emits = defineEmits(['submit', 'deleteItem', 'editItem', 'deleteAnswer', 'updateAnswer', 'saveNewAnswer', 'saveAutoAnswer'])
const item = computed(() => props.item)
const index = computed(() => props.index)
const answers = computed(() => props.answers)
const autoAnswers = computed(() => props.autoAnswers)
const editable = computed(() => props.editable)
const newAnswer = ref({content: null, ref: {}})

const isInAnswers = computed(() => (answer) => {
    if (!answer) return false
    return answers.value.some(a => {
        if (answer.ref) {
            return a.ref.id === answer.ref.id
        } else {
            return a.content === answer.content
        }
    })
})
</script>

<template>
    <el-form
        label-width="auto"
        size="large"
        label-position="top">
        <el-row>
            <el-space direction="horizontal">
                <el-text>{{ index + 1 }}. {{ item.label }}</el-text>
                <el-tag type="primary" v-if="item.ref">
                    绑定的属性：{{ item.ref.key }}
                </el-tag>
                <el-tag type="info" v-if="item.object">
                    {{ item.object.name }}
                </el-tag>
                <el-tag v-if="item.multiple" type="danger">
                    多选
                </el-tag>
                <el-button-group v-if="editable" size="large" class="sl-4">
                    <el-button type="primary" @click="emits('editItem', item)" icon="Edit" link/>
                    <el-button type="danger" @click="emits('deleteItem', item)" icon="Close" link/>
                </el-button-group>
            </el-space>
        </el-row>
        <el-space style="margin-top: 10px" direction="vertical">
            <dcf-form-item
                v-for="(answer, index) in answers"
                :key="index"
                :item="item"
                v-model="answers[index]"
                @remove="emits('deleteAnswer', answers[index])"
                show
                remove
                disabled
            />
            <template v-if="!answers || answers.length === 0 || item.multiple">
                <template v-for="(autoAnswer, index) in autoAnswers">
                    <dcf-form-item
                        v-if="!isInAnswers(autoAnswers[index])"
                        :key="autoAnswer.id"
                        :item="item"
                        v-model="autoAnswers[index]"
                        @submit="emits('saveAutoAnswer', {index: index})"
                        :submit-visible="true"
                        show
                        submit
                        disabled
                    />
                </template>
            </template>
            <dcf-form-item
                v-if="!answers || answers.length === 0 || item.multiple"
                type="submit"
                :item="item"
                @submit="emits('saveNewAnswer', {answer: newAnswer})"
                v-model="newAnswer"
                submit
            />
        </el-space>
    </el-form>
</template>

<style scoped>

</style>