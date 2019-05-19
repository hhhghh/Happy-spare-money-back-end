const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const routers = require('./routes/routers')
const cors = require('koa-cors');

const session = require("koa-session2")
const Store = require('./controller/Store.js')

// 使用koa-cors
app.use(cors());

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(routers.index.routes(), routers.index.allowedMethods())
app.use(routers.team_api.routes(), routers.team_api.allowedMethods())
app.use(routers.task_api.routes(), routers.task_api.allowedMethods())
app.use(routers.user_api.routes(), routers.user_api.allowedMethods())
app.use(routers.tr_api.routes(), routers.tr_api.allowedMethods())

app.use(session({
  store: new Store(),
  key: "SESSIONID",
}));

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
