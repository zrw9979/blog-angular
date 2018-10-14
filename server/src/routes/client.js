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

router.get('/listByPv', async (ctx, next) => {
  try {
    let res = await DB.Article.find({ state: "publish" }).sort({"pv": -1});
    if (res) {
      ctx.response.body = {
        code: 200,
        msg: 'msg',
        data: res
      }
    } else {
      ctx.throw(500)
      return;
    }
  } catch (e) {
    breakError = true
    console.log(e.message)
  }
})

router.get('/listByUv', async (ctx, next) => {
  try {
    let res = await DB.Article.find({ state: "publish" }).sort({ "uv": -1 });
    if (res) {
      ctx.response.body = {
        code: 200,
        msg: 'msg',
        data: res
      }
    } else {
      ctx.throw(500)
      return;
    }
  } catch (e) {
    breakError = true
    console.log(e.message)
  }
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

router.post('/searchTitle', async (ctx, next) => {
  try {
    let search = ctx.request.body.search;
    let q = decodeURIComponent(search)
    let Exp = new RegExp(q)
    let res = await DB.Article.find({ $and: [{ title: Exp }]})
    if (res) {
      ctx.response.body = {
        code: 200,
        msg: 'msg',
        data: res
      }
    } else {
      ctx.throw(500)
      return;
    }
  } catch (e) {
    breakError = true
    console.log(e.message)
  }
})

router.post('/searchById', async (ctx, next) => {
  try {
    let search = ctx.request.body.search;
    let res = await DB.Article.find({ _id: ctx.request.body.search })
    if (res) {
      ctx.response.body = {
        code: 200,
        msg: 'msg',
        data: res
      }
    } else {
      ctx.throw(500)
      return;
    }
  } catch (e) {
    breakError = true
    console.log(e.message)
  }
})

router.post('/articleAddPv', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    DB.Article.update({
      _id: ctx.request.body._id,
    }, ctx.request.body, (err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  }).then((success) => {
    ctx.response.body = {
      code: 200,
      msg: '修改成功',
      data: ctx.request.body
    }
  })
})

router.post('/articleAddUv', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    DB.Article.update({
      _id: ctx.request.body._id,
    }, ctx.request.body, (err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  }).then((success) => {
    ctx.response.body = {
      code: 200,
      msg: '修改成功',
      data: ctx.request.body
    }
  })
})

router.post('/addFansEmail', async (ctx, next) => {
  await new DB.Fans(ctx.request.body).save((err, data) => {
    if(err){
      ctx.throw(500)
      return
    }
    ctx.response.body = {
      code: 200,
      msg: '订阅成功',
      data
    }
  })
})

module.exports = router