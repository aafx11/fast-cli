// 递归的序列化代码
module.exports = function stringifyJS(value) {
  // https://www.npmjs.com/package/javascript-stringify/v/2.1.0
  const { stringify } = require('javascript-stringify');
  return stringify(value, (val, indent, stringify) => {
    if (val && val.__expression) {
      return val.__expression;
    }

    return stringify(val);
  }, 4);
};