const path = require('path');

// 日志存储目录
const LOG_DIR = path.join(process.cwd(), 'logs');

// 日志级别：trace < debug < info < warn < error < fatal
const levels = {
  error: 'error',   // 错误日志级别
  access: 'info',   // 访问日志级别
};

module.exports = {
  // 日志存储目录
  logDir: LOG_DIR,

  // log4js 配置
  log4jsConfig: {
    appenders: {
      // 控制台输出
      console: {
        type: 'console',
      },
      // 错误日志 - 单独输出
      errorFile: {
        type: 'dateFile',
        filename: path.join(LOG_DIR, 'error.log'),
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 10 * 1024 * 1024,
        backups: 7,
        compress: true,
        keepFileExt: true,
      },

      // 访问日志 - 单独输出
      accessFile: {
        type: 'dateFile',
        filename: path.join(LOG_DIR, 'access.log'),
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: true,
        encoding: 'utf-8',
        maxLogSize: 10 * 1024 * 1024,
        backups: 7,
        compress: true,
        keepFileExt: true,
      },
    },

    categories: {
      // log4js 要求存在 default 分类，不用于业务日志
      default: {
        appenders: ['errorFile'],
        level: 'off',
      },

      // 错误分类 - 输出到控制台 + 错误日志文件
      error: {
        appenders: ['console', 'errorFile'],
        level: levels.error,
      },

      // 访问日志分类
      access: {
        appenders: ['console', 'accessFile'],
        level: levels.access,
      },
    },
  },
};