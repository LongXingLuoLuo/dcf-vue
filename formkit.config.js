import {zh} from '@formkit/i18n'
import {genesisIcons} from '@formkit/icons'
import {createProPlugin, rating, toggle, repeater, colorpicker} from '@formkit/pro'
import '@formkit/themes/genesis'
import '@formkit/pro/genesis'
import { createMultiStepPlugin } from '@formkit/addons'
import '@formkit/addons/css/multistep'

const proPlugin = createProPlugin('fk-828d74820b', {
    rating,
    toggle,
    repeater,
    colorpicker
})
const config = {
    locales: {zh},
    locale: 'zh',
    theme: 'genesis',
    icons: {
        genesisIcons
    },
    plugins: [proPlugin, createMultiStepPlugin()],
}

export default config