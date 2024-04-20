const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./model/post');
const headers = require('./utils/header');
const successHandler = require('./handler/successHandler');
const errorHandler = require('./handler/errorHandler');
dotenv.config({ path: './config.env' });

// 連接資料庫
const db = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);
const localDB = 'mongodb://127.0.0.1:27017/hotel';
mongoose
  .connect(db)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  // 查詢
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find();
    successHandler(res, posts);
  } else if (req.url === '/posts' && req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  // 新增
  else if (req.url === '/post' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        // 新增資料
        const data = JSON.parse(body);
        const newPost = await Post.create({
          content: data.content,
          image: data.image,
          name: data.name,
        });
        successHandler(res, newPost);
      } catch (error) {
        errorHandler(res, error);
      }
    });
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'failed',
        message: '無此網址',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3000);
