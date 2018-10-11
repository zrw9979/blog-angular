const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const DB = require('../models')
const users = require('../users/index').items
const nodemailer = require('nodemailer')

const findUser = (name, password) => {
	return users.find((item) => {
		return item.name === name && item.password === password;
	});
};

const resolve = file => path.resolve(__dirname, file)
const router = new Router()

router.post('/login', async (ctx, next) => {
	let user = findUser(ctx.request.body.name, ctx.request.body.pwd);
	if(user){
		let session = ctx.session
		session.isLogin = true
		session.userName = ctx.request.body.name
		ctx.body = {
      code: 200,
      msg: '登录成功！'
    }
	}else{
		ctx.body = {
      code: 400,
      msg: '账号或密码错误！'
    }
	}
})

router.post('/setting', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    DB.User.update({
      name: ctx.request.body.name, 
    }, ctx.request.body, (err, docs) => {
      if(err){
        reject(err)
      }else{
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

router.post('/addUser', async (ctx, next) => {
  await new DB.User(ctx.request.body).save((err, data) => {
    if(err){
      ctx.throw(500)
      return
    }
    ctx.response.body = {
      code: 200,
      msg: '修改成功',
      data
    }
  })
})

router.get('/userInfo', async (ctx, next) => {
  await DB.User.find({}, (err, data) => {
    if (err) {
      ctx.throw(500)
      return;
    }
    console.log(data)
    ctx.response.body = {
      code: 200,
      msg: 'success',
      data
    }
  })
})

router.get('/logout', async (ctx, next) => {
	ctx.session = null;
	ctx.response.body = {
    code: 200,
		msg: '退出登录成功！'
  }
})

router.all('*', async (ctx, next) => {
  if ( ctx.session && ctx.session.isLogin && ctx.session.userName ) {
		await next()
	} else {
		ctx.body = {
      code: 401,
			msg: 'Unauthorized'
    }
	}
})

// 保存文章
router.post('/addArticle', async (ctx, next) => {
  new DB.Article(ctx.request.body).save((err, docs) => {
    if(err){
      ctx.throw(500)
      return
    }
    let emailResult = ''
    // let emailResult = onSendEmail(ctx.request.body)
    ctx.response.body = {
      code: 200,
      msg: `保存成功，邮件发送${emailResult}`,
      data: docs
    }
  })
})

// 删除文章
router.post('/deleteArticle', async (ctx, next) => {
  await DB.Article.remove({_id: ctx.request.body.id,}, (err, docs) => {
    if(err){
      ctx.throw(500)
      return
    }
    ctx.response.body = {
      code: 200,
      msg: '删除成功',
      data: docs
    }
  })
})

// 修改文章
router.post('/modifyArticle', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    DB.Article.update({
      _id: ctx.request.body._id, 
    }, ctx.request.body, (err, docs) => {
      if(err){
        reject(err)
      }else{
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

// 获取文章列表数据
router.get('/articleList', async (ctx, next) => {
  await DB.Article.find({}, (err, docs) => {
    if (err) {
      ctx.throw(500)
      return;
    }
    ctx.response.body = {
      code: 200,
      msg: 'success',
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
      msg: 'success',
      data: docs
    }
  })
})

// 新增标签
router.post('/addTag', async (ctx, next) => {
  await new DB.Tag(ctx.request.body).save((err, docs) => {
    if(err){
      ctx.throw(500)
      return
    }
    ctx.response.body = {
      code: 200,
      msg: '新增成功',
      data: docs
    }
  })
})

// 删除标签
router.post('/deleteTag', async (ctx, next) => {
  await DB.Tag.remove({
    _id: ctx.request.body.id,
  }, (err, docs) => {
    if(err){
      ctx.throw(500)
      return
    }
    ctx.response.body = {
      code: 200,
      msg: '删除成功',
      data: docs
    }
  })
})

const onSendEmail = (req) => {
  console.log('on send email')
  sendEmail(req)
  // DB.Fans.find({}, (err, docs) => {
  //   if (docs && docs.length > 0) {
  //   } else {
  //     return 'failed'
  //   }
  // })
}

let serveremail = {
  user: "493143643@qq.com",
  password: "ojhwdeiigetcbgbb",
  service: 'qq'
}

const sendEmail = async () => {
  console.log('send email')
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    console.log(serveremail.service)
    let transporter = nodemailer.createTransport({
      host: serveremail.service, // 邮件服务地址 可在126后台查看
      port: 465, // port
      secure: true, // true for 465, false for other ports
      auth: {
          user: serveremail.user, // generated ethereal user
          pass: serveremail.password // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: serveremail.user, // sender address  
      to: "493143643@qq.com", // list of receivers 接收者地址
      subject: 'Hello friend', // Subject line                      // 邮件标题
      text: 'this is nodemailer test', // plain text body
      html: '<b>Big test</b>' // html body   //邮件内容
    };

    transporter.sendMail(mailOptions, (error, info) => { //发送邮件
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);//成功回调
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}


module.exports = router