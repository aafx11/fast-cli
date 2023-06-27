const chalk = require('chalk');
// https://github.com/facebook/jscodeshift
// 将代码解析成 AST，再将参数 imports 中的语句插入
module.exports = function injectImports(fileInfo, api, { imports }) {
  const jscodeshift = api.jscodeshift;
  // fileInfo.source 为文件代码字符串,通过 jscodeshift 解析成 AST
  /* fileInfo.source的代码
  import Vue from 'vue';
  import App from './App.vue'; 

  Vue.config.productionTip = false;

  new Vue({
    render: (h) => h(App),
  }).$mount('#app'); 
  */
  const root = jscodeshift(fileInfo.source);

  // 将参数中的 imports 语句转换成AST
  const toImportAST = i => jscodeshift(`${i}\n`).nodes()[0].program.body[0];
  const toImportHash = node => JSON.stringify({
    specifiers: node.specifiers.map(s => s.local.name), // 'App'
    source: node.source.raw, // './App.vue'
  });

  // 找到导入声明
  const declarations = root.find(jscodeshift.ImportDeclaration);
  
  /**
   *    importSet
   *   `{"specifiers":["Vue"],"source":"'vue'"}`,
   *   `{"specifiers":["App"],"source":"'./App.vue'"}`
   */
  const importSet = new Set(declarations.nodes().map(toImportHash));

  const nonDuplicates = node => !importSet.has(toImportHash(node));
  // 将参数中的 imports 语句转换成AST,再 filter 与原有的 importSet 去重,最终得出需要添加的导入语句
  const importASTNodes = imports.map(toImportAST).filter(nonDuplicates);

  // 找到原有的最后一个导入语句,在后面插入需要添加的导入语句
  if (declarations.length) {
    declarations
    .at(-1)
    // a tricky way to avoid blank line after the previous import
    .forEach(({ node }) => delete node.loc)
    .insertAfter(importASTNodes);
  } else {
    // no pre-existing import declarations
    root.get().node.program.body.unshift(...importASTNodes);
  }

  // 将修改后的 AST 转换回 JavaScript 代码字符串
  return root.toSource();
};
