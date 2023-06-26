const chalk = require('chalk');
// https://github.com/facebook/jscodeshift
// 将代码解析成 AST，再将参数 imports 中的语句插入
module.exports = function injectImports(fileInfo, api, { imports }) {
    const jscodeshift = api.jscodeshift;
    // fileInfo.source 为文件代码字符串,通过 jscodeshift 解析成 AST
    const root = jscodeshift(fileInfo.source);
    console.log(`${chalk.red('root')}`, root);

    const toImportAST = i => jscodeshift(`${i}\n`).nodes()[0].program.body[0];
    const toImportHash = node => JSON.stringify({
        specifiers: node.specifiers.map(s => s.local.name),
        source: node.source.raw,
    });

    const declarations = root.find(jscodeshift.ImportDeclaration);
    const importSet = new Set(declarations.nodes().map(toImportHash));
    const nonDuplicates = node => !importSet.has(toImportHash(node));

    const importASTNodes = imports.map(toImportAST).filter(nonDuplicates);

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
