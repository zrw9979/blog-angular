const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const DB = require('../models')
const users = require('../users/index').items

const resolve = file => path.resolve(__dirname, file)
const router = new Router()

router.get('/userInfo', async (ctx, next) => {
  await DB.User.find({}, (err, data) => {
    if (err) {
      ctx.throw(500)
      return;
    }
    console.log(data.length)
    if (data.length > 0) {
      ctx.response.body = {
        code: 200,
        msg: 'success',
        data: data[0]
      }
    } else {
      ctx.response.body = {
        code: 200,
        msg: 'success',
        data: users
      }
    }
  })
})

// 获取文章列表数据
router.get('/articleList', async (ctx, next) => {
  await DB.Article.find({state: "publish"}, (err, docs) => {
    if (err) {
      ctx.throw(500)
      return;
    }
    ctx.response.body = {
      code: 200,
      msg: 'msg',
      data: docs
    }
  })
})

// 获取标签数据
router.get('/tagList', async (ctx, next) => {
  await DB.Tag.find({}, (err, docs) => {
    if (err) {
      ctx.throw(500)
      return;
    }
    ctx.response.body = {
      code: 200,
      msg: 'msg',
      data: docs
    }
  })
})

module.exports = router