import pluginVue from 'eslint-plugin-vue'
import prettierConfig from '@vue/eslint-config-prettier'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'

export default defineConfigWithVueTs(
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    prettierConfig,
    globalIgnores(['build/', 'dist/', 'tailwind.config.cjs', 'src/generated/']),
    {
        rules: {
            '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
            'vue/multi-word-component-names': 'off',
        },
    },
)