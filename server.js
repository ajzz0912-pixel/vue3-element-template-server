const Koa = require('koa');
const routes = require('./src/routes');
const cors = require('koa2-cors');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const { accessLogger, requestLogger } = require('./src/middleware/logger');
var jwt = require('koa-jwt');
const { secretKey } = require('./src/utils/jwt');
const { getLogger } = require('./src/utils/logger');
const logger = getLogger('access', 'app');
app.use(bodyParser({enableTypes: ['json', 'form', 'text']}));
app.use(accessLogger());
app.use(requestLogger());
app.use(cors())

app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.body = {
        code: 100401,
        message: 'token 过期,请重新登陆',
      };
    } else {
      throw err;
    }
  });
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(`请求异常: ${err.message}`);
    logger.error(err.stack);
    ctx.status = err.status || 100500;
    ctx.body = {
      code: ctx.status,
      message: err.message || '服务器内部错误',
    };
  }
});


app.use(jwt({ secret: secretKey }).unless({
  path: [
    /^\/api\/user\/login/,
    /^\/api\/user\/register/,
  ],
}));

app.use(routes.routes());
app.use(routes.allowedMethods());

app.use(async (ctx) => {
  if (ctx.status === 404 || ctx.body === undefined) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: '接口不存在，请检查请求路径',
      path: ctx.url,
    };
  }
});

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});