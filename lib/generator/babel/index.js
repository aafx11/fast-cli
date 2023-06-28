module.exports = (generator) => {
  generator.extendPackage({
    babel: {
      presets: ['@babel/preset-env'],
    },
    dependencies: {
      // core-js 它是JavaScript标准库的 polyfill（垫片/补丁）, 新功能的es'api'转换为大部分现代浏览器都可以支持运行的一个'api' 补丁包集合。
      'core-js': '^3.8.3',
    },
    devDependencies: {
      '@babel/core': '^7.12.13',
      '@babel/preset-env': '^7.12.13',
      'babel-loader': '^8.2.2',
    },
  });
};