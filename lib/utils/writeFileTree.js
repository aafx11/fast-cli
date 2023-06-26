const fs = require('fs-extra');
const path = require('path');

module.exports = async function writeFileTree(dir, files) {
    Object.keys(files).forEach(name => {
        const filePath = path.join(dir, name);
        // fs.ensureDirSync() ，用于确保目录在文件系统中存在，如果不存在则创建
        // path.dirname() ，用于获取一个路径的目录部分 /path/to/file.txt' -> /path/to
        fs.ensureDirSync(path.dirname(filePath));
        // fs.writeFileSync() ，用于以同步方式将数据写入文件
        fs.writeFileSync(filePath, files[name]);
    });
};