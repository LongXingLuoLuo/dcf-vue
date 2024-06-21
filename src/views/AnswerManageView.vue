<script setup>
import {computed, reactive, ref} from "vue";
import formApi from "@/axios/formApi.js";
import itemApi from "@/axios/itemApi.js";
import answerApi from "@/axios/answerApi.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const props = defineProps(['id']);
// 表格配置
const tableRef = ref()
const gridOptions = reactive({
    border: true,
    loading: false,
    columns: [],
    data: [],
    showOverflow: true,
    rowConfig: {
        isHover: true
    },
    columnConfig: {
        resizable: true,
    }
})
const printConfig = reactive({
    // 自定义打印的样式示例
    style: `
    .vxe-table {
      color: #000000; // 修改表格默认颜色
      font-size: 12px; // 修改表格默认字体大小
      font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu; // 修改表格默认字体
    }
    .vxe-table,
    .vxe-table thead th,
    .vxe-table tbody td,
    .vxe-table tfoot td  {
      border-color: #000000; // 修改表格边框颜色
    }
    .vxe-table thead th {
      color: green; // 修改表头字体颜色
      font-size: 14px; // 修改表头默认字体大小
    }
    .vxe-table tfoot td {
      color: red; // 修改表尾字体颜色
    }
    `
})
// 数据
const form = ref({'id': 0, 'title': '表单标题', 'description': '表单描述'});
const items = ref([]);
const allAnswers = ref([]);
const columns = computed(() => {
    let children = []
    items.value.sort((a, b) => a.order - b.order)
    for (const item of items.value) {
        children.push({field: `item-${item.id}`, title: item.label, sortable: true})
    }
    return [
        {title: '#', width: 60, type: 'seq'},
        {field: 'userId', title: '填写者 id', width: 260},
        {title: '填写的数据', children: children}
    ]
})

const formatter =  (item, answer) => {
    try {
        if (item.formatter) {
            return new Function('answer', `return ${item.formatter}`)(answer);
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
}

const tableData = computed(() => {
    let data = {}
    for (const answer of allAnswers.value) {
        if (!data[answer.user.id]) {
            data[answer.user.id] = {userId: `user-${answer.user.id}`}
        }
        if (!data[answer.user.id][`item-${answer.formItem.id}`]) {
            data[answer.user.id][`item-${answer.formItem.id}`] = formatter(answer.formItem, answer)
        } else {
            data[answer.user.id][`item-${answer.formItem.id}`] += ',' + formatter(answer.formItem, answer)
        }
    }
    return Object.values(data)

})

const refresh = () => {
    gridOptions.loading = true
    // gridOptions.loading = true
    formApi.getFormById(props.id)
        .then(res => {
            form.value = res
        })
        .catch(err => {
            ElMessage.error(err)
        })
    itemApi.getAllItemsByFormId(props.id)
        .then(res => {
            items.value = res
        })
        .catch(err => {
            ElMessage.error(err)
        })
    answerApi.getAllAnswersByFormId(props.id)
        .then(res => {
            allAnswers.value = res
        })
        .catch(err => {
            ElMessage.error(err)
        })
    setTimeout(() => {
        gridOptions.loading = false
        gridOptions.columns = columns
        gridOptions.data = tableData
    }, 1500)
}

const exportDataEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.exportData({type: 'csv'})
    }
}

const printEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.openPrint()
    }
}

const openExportEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.openExport()
    }
}
refresh();

</script>

<template>
    <el-page-header @back="router.go(-1)">
        <template #breadcrumb>
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{name: 'home'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{name: 'formManage'}">表单管理</el-breadcrumb-item>
                <el-breadcrumb-item>表单后台</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
        <template #content>
            <span class="font-bold font-600">{{form.title}} 的表单后台</span>
        </template>
    </el-page-header>
    <el-container>
        <el-main>
            <vxe-toolbar  v-slot:buttons>
                <vxe-button type="primary" @click="refresh">刷新</vxe-button>
                <vxe-button type="primary" @click="openExportEvent">导出数据</vxe-button>
                <vxe-button type="primary" @click="printEvent">打印数据</vxe-button>
            </vxe-toolbar>
            <vxe-grid :print-config="printConfig" ref="tableRef" v-bind="gridOptions"/>
        </el-main>
    </el-container>
</template>

<style scoped>
</style>