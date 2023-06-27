module.exports = (generator, options = {}) => {
  // 注入依赖
  generator.injectImports(generator.entryFile, `import router from './router';`);
  // 在Vue中初始化插件
  generator.injectRootOptions(generator.entryFile, `router`);

  generator.extendPackage({
    dependencies: {
      'vue-router': '^3.5.1',
    },
  });

  generator.render('./template', {
    historyMode: options.historyMode,
    hasTypeScript: false,
    plugins: [],
  });
};