const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const path = require('path')
const staticCache = require('koa-static-cache')
const session = require('koa-session-minimal')
const MongoStore = require('koa-generic-session-mongo')
const router = require('./src/routes/index')
const config = require('./src/config/index')

const resolve = file => path.resolve(__dirname, file)
const app = new Koa()

app.use(staticCache({
  dir: resolve('./dist'),
  maxAge: 365 * 24 * 60 * 60,
  gzip: true
}))

let cookie = {
  maxAge: 5 * 60 * 1000, // cookie有效时长
  expires: '',  // cookie失效时间
  path: '', // 写cookie所在的路径
  domain: '', // 写cookie所在的域名
  httpOnly: true, // 是否只用于http请求中获取
  overwrite: '',  // 是否允许重写
  secure: '',
  sameSite: '',
  signed: '',
}
app.use(session({
  key: 'SESSION_ID',
  store: new MongoStore({}),
  cookie: cookie
}))

app.use(cors())
app.use(bodyParser())
app.use(router.routes())

app.listen(9979, '0.0.0.0', ()=> {
  console.log('监听端口:' + 9979)
  console.log("环境变量是:" + process.env.NODE_ENV);
})