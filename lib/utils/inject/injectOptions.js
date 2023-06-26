// https://github.com/facebook/jscodeshift
// 对代码进行解析得到 AST，再将参数 injections 中的语句插入
module.exports = function injectOptions(fileInfo, api, { injections }) {
    const jscodeshift = api.jscodeshift;
    const root = jscodeshift(fileInfo.source);

    const toPropertyAST = i => jscodeshift(`({${i}})`).nodes()[0].program.body[0].expression.properties[0];

    const properties = root
    .find(jscodeshift.NewExpression, {
        callee: { name: 'Vue' },
        arguments: [{ type: 'ObjectExpression' }],
    })
    .map(path => path.get('arguments', 0))
    .get()
    .node
    .properties;

    const toPropertyHash = p => `${p.key.name}: ${jscodeshift(p.value).toSource()}`;
    const propertySet = new Set(properties.map(toPropertyHash));
    const nonDuplicates = p => !propertySet.has(toPropertyHash(p));

    // inject at index length - 1 as it's usually the render fn
    properties.splice(-1, 0, ...injections.map(toPropertyAST).filter(nonDuplicates));

    // 将修改后的 AST 转换回 JavaScript 代码字符串
    return root.toSource();
};
