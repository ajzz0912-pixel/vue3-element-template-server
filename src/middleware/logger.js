const { log4js } = require('../utils/logger');

/**
 * 访问日志中间件
 * 记录每次请求的 Method、URL、状态码、响应时间
 */
const accessLogger = () => {
  const logger = log4js.getLogger('access');

  return async (ctx, next) => {
    const start = Date.now();
    const { method, url, ip } = ctx;

    try {
      await next();
    } finally {
      const duration = Date.now() - start;
      const status = ctx.status || 404;

      // 记录访问日志
      const logMessage = `[${method}] ${url} | ${status} | ${duration}ms | ${ip}`;

      // 4xx/5xx 用 warn/error 级别记录
      if (status >= 500) {
        logger.error(logMessage);
      } else if (status >= 400) {
        logger.warn(logMessage);
      } else {
        logger.info(logMessage);
      }
    }
  };
};

/**
 * 请求日志中间件（挂载到 ctx 上，方便业务代码中使用）
 */
const requestLogger = () => {
  return async (ctx, next) => {
    // 将日志实例挂载到 ctx.logger，业务代码中可直接使用
    const { getLogger } = require('../utils/logger');
    ctx.logger = getLogger('default', 'request');

    await next();
  };
};

module.exports = {
  accessLogger,
  requestLogger
};