const express = require('express');
const http = require('http');
const chalk = require('chalk');
const path = require('path');

module.exports = async (options, cb = null) => {
  // 创建一个Express应用程序，并将其绑定到了一个HTTP服务器上，使它可以监听和处理客户端的HTTP请求
  const app = express();
  const httpServer = http.createServer(app);
  console.log(`${chalk.red('httpServer')}`, httpServer);

  app.use(express.static(path.join(__dirname, '../src/dist')));
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../src/dist', 'index.html'));
  // });

  app.get('/api/data', (req, res) => {
    const data = {
      message: 'Hello, World!',
    };
  
    res.json(data);
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有域名的请求
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.listen(options.port, () => {
    console.log(`${chalk.blue(`Server is running on port ${options.port}`)}`);
  });

  cb && cb();
};