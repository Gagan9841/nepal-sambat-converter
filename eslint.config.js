import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import * as parser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'
import typescriptEslint from 'typescript-eslint'
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist', 'src/components/ui/**/*'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 0,
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
  eslintConfigPrettier,
)
