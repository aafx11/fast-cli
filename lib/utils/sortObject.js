module.exports = function sortObject (obj, keyOrder, isSortByUnicode = true) {
  if (!obj) return;

  const result = {};
  // 先按照 keyOrder 将 obj 排序
  if (keyOrder) {
    keyOrder.forEach(element => {
      // 如果 obj 里有这个 key 就放进 result
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key];
        delete obj[key];
      }
    });
  }

  // 将剩下的 key 用 sort() 方法排序
  const keys = Object.keys(obj);

  isSortByUnicode && keys.sort();
  keys.forEach(key => {
    result[key] = obj[key];
  });

  return result;
};