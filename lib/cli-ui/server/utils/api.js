const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const ApiResponse = require('./ApiResponse');
const Generator = require('../../../Generator');

exports.registerApi = (app) => {
  app.use(express.json());

  // 目标文件是否已存在
  app.get('/file/fileHasExists', (req, res, next) => {
    console.log(req.query);
    const targetDir = path.join(process.cwd(), req.query.name);
    if (fs.existsSync(targetDir)) {
      res.json(new ApiResponse(409, false, null, '目标文件已存在'));
    } else {
      res.json(new ApiResponse(200, true));
    }
  });

  // 创建项目
  app.post('/project/createProject', async (req, res, next) => {
    try {
      let { options, name } = req.body;
      console.log('options', req.body.options);
      console.log('name', req.body.name);

      const targetDir = path.join(process.cwd(), name);
      if (fs.existsSync(targetDir)) {
        res.json(new ApiResponse(409, false, null, '目标文件已存在'));
        return;
      }
  
      let generatorList = [];
      options.features.forEach(feature => {
        generatorList.push(`../../../generator/${feature}`); 
      });
      const pkg = options.preset?{}: {
        name,
        version: '0.1.0',
        dependencies: {},
        devDependencies: {},
      };
    
      const generator = new Generator(pkg, targetDir);

      generatorList.forEach(g => {
        require(`${g}`)(generator, options);
      });
      options.preset? await generator.generateByRemote() : await generator.generate();
      res.json(new ApiResponse(200, true));
    } catch (error) {
      next(error); // 将错误对象传递给错误处理中间件
    }
  });

  // 错误处理中间件
  app.use((err, req, res, next) => {
    console.log('message', err.message);
    if (err instanceof SyntaxError) {
      // 语法错误的处理
      res.status(500).json(new ApiResponse(400, false, null, err.message || '请求参数格式错误'));
    } else {
      // 其他错误的通用处理
      res.status(500).json(new ApiResponse(500, false, null, err.message || '服务器内部错误'));
    }
  });
};