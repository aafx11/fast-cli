const chalk = require('chalk');

// https://github.com/facebook/jscodeshift
// 对代码进行解析得到 AST，再将参数 injections 中的语句插入
module.exports = function injectOptions(fileInfo, api, { injections }) {
  const jscodeshift = api.jscodeshift;
  const root = jscodeshift(fileInfo.source);

  const toPropertyAST = i => jscodeshift(`({${i}})`).nodes()[0].program.body[0].expression.properties[0];

  /*  
   new Vue({
    render: (h) => h(App),
   }).$mount('#app');
   这是一个 CallExpression 函数执行表达式语句, new Vue() 是 NewExpression New表达式, 
   name 为Vue , arguments 参数的类型是 ObjectExpression 对象表达式,需要往对象的 properties 属性里添加需要注册的插件
  */
  const properties = root
  // 找到New表达式,name 为Vue ,参数为对象
  .find(jscodeshift.NewExpression, {
    callee: { name: 'Vue' },
    arguments: [{ type: 'ObjectExpression' }],
  })
  // 获取 New 表达式的第一个对象参数,目前对象里只有一个属性(render: (h) => h(App))
  .map(path => path.get('arguments', 0))
  .get()
  .node
  .properties;

  const toPropertyHash = p => `${p.key.name}: ${jscodeshift(p.value).toSource()}`;
  const propertySet = new Set(properties.map(toPropertyHash));
  // propertySet [{ 'render: (h) => h(App)' }]
  const nonDuplicates = p => !propertySet.has(toPropertyHash(p));

  // inject at index length - 1 as it's usually the render fn
  // 将需要插入的属性转换成 AST 后去重,再插入到 properties 中
  properties.splice(-1, 0, ...injections.map(toPropertyAST).filter(nonDuplicates));

  // 将修改后的 AST 转换回 JavaScript 代码字符串
  return root.toSource();
};
