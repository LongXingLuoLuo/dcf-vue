import {computed} from "vue";
import router from "@/router/index.js";

// const visitUrl = computed(() => (formId) => {
//     return `${window.origin}${router.resolve({name: 'formVisit', params: {'id': formId}}).href}`
// })
// const visitHref = computed(() => (formId) => {
//     return router.resolve({name: 'formVisit', params: {'id': formId}}).href
// })
const visitUrl = (formId) => {
    return `${window.origin}${router.resolve({name: 'formVisit', params: {'id': formId}}).href}`
}
const visitHref = (formId) => {
    return router.resolve({name: 'formVisit', params: {'id': formId}}).href
}
export {visitUrl, visitHref}