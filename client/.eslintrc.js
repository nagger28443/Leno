module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb'],
  plugins: ['react'],
  rules: {
    // 一个函数的复杂性不超过 10，所有分支、循环、回调加在一起，在一个函数里不超过 10 个
    // "complexity": [2, 10],
    // 一个函数的嵌套不能超过 4 层，多个 for 循环，深层的 if-else，这些都是罪恶之源
    'max-depth': [2, 4],
    // 一个函数最多有 3 层 callback，使用 async/await
    'max-nested-callbacks': [2, 3],
    // 一个函数最多 5 个参数。参数太多的函数，意味着函数功能过于复杂，请拆分
    'max-params': [2, 5],
    // 一个函数最多有 50 行代码，如果超过了，请拆分之，或者精简之
    'max-statements': [2, 50],
    // 坚定的 semicolon-less 拥护者
    semi: [2, 'never'],
    'linebreak-style': 0,
    'react/prop-types': 0,
    'max-len': [2, 120],
    'no-plusplus': 0,
    'react/sort-comp': 0,
    'no-case-declarations': 0,
    'no-cond-assign': 0,
    'no-console': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/no-did-mount-set-state": 0,
    "arrow-parens":0,
    "react/jsx-one-expression-per-line":0,
    "react/button-has-type":0,
    "react/destructuring-assignment":0,
    "react/no-did-update-set-state":0
  },
  env: {
    browser: true,
    jest:true
  },
  settings: {
    'import/resolver': {
      webpack:{
        config: './build/webpack.base.js'
      }

    }
  }
}
