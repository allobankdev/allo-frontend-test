/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),

  {
    rules: {
      "no-alert": "off",
      "no-console": "off",
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
      "vue/html-closing-bracket-newline": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/valid-v-slot": ['error', { allowModifiers: true, },],
    },
    "vue/block-lang": ["error", {
      "script": {
        "lang": "js"
      },
      "allowNoLang": true
    }]
  }
]
