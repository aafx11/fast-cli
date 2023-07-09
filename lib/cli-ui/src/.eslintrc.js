module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019,
    parser: '@babel/eslint-parser',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended', // 使用 vue 推荐配置
    'airbnb-base',
  ],
  rules: {
    'no-console': 'off',
    'array-element-newline': ['error', 'consistent'],
    indent: ['error', 2, { MemberExpression: 0, SwitchCase: 1 }],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'linebreak-style': 'off',
    semi: ['error', 'always'],
    'comma-dangle': 'off',
    'import/no-unresolved': 'off',
    'eol-last': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'prefer-destructuring': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: {
        max: 3,
        allowFirstLine: false
      }
    }]
  },
};
