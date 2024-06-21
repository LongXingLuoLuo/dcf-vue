import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import FormEdit from "@/views/FormEditView.vue";
import FormManage from '@/views/FormManageView.vue'
import FormVisit from "@/views/FormVisitView.vue";
import AnswerManage from "@/views/AnswerManageView.vue";
import Register from "@/views/RegisterView.vue";
import ObjectManage from "@/views/ObjectManageView.vue";
import ModelManage from "@/views/ModelManageView.vue";
import ModelEdit from "@/views/ModelEditView.vue";
import ModelVisit from "@/views/ModelVisitView.vue";
import FormVisitable from "@/views/FormVisitableView.vue";
import userManage from "@/views/UserManageView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/logout',
        name: 'logout',
        component: Login
    }, {
        path: '/register',
        name: 'register',
        component: Register
    }, {
        path: '/form/:id/visit',
        name: 'formVisit',
        props: true,
        component: FormVisit
    }, {
        path: '/form/:id/edit',
        name: 'formEdit',
        props: true,
        component: FormEdit
    }, {
        path: '/form/manage',
        name: 'formManage',
        component: FormManage
    }, {
        path: '/form/visitable',
        name: 'formVisitable',
        component: FormVisitable
    }, {
        path: '/form/:id/answer/manage',
        name: 'formAnswerManage',
        props: true,
        component: AnswerManage
    }, {
        path: '/object/manage',
        name: 'objectManage',
        component: ObjectManage
    }, {
        path: "/model/manage",
        name: "modelManage",
        component: ModelManage
    }, {
        path: '/model/:id/edit',
        name: 'modelEdit',
        props: true,
        component: ModelEdit
    }, {
        path: '/model/:id/visit',
        name: 'modelVisit',
        props: true,
        component: ModelVisit
    }, {
        path: '/user/manage',
        name: 'userManage',
        component: userManage
    }]
})

export default router
