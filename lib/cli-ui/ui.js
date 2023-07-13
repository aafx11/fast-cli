const open = require('open');
const server = require('./server/index');

async function ui(options = {}, context = process.cwd()) {
  const host = options.host || 'localhost';
  const port = options.port || 8088;

  const opts = {
    host,
    port,
  };

  await server(opts, () => {
    // 打开浏览器
    const url = `http://${host}:${port}`;
    open(url);
  });
}

module.exports =async (...args) => {
  return ui(...args).catch(err => {
    console.log(err);
  });
};