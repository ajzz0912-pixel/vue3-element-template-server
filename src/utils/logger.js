const log4js = require('log4js');
const { log4jsConfig } = require('../config/logger');

// 初始化 log4js
log4js.configure(log4jsConfig);

/**
 * 获取日志实例
 * @param {string} category - 分类名称 (error | access)
 * @param {string} moduleName - 模块名称，用于标识日志来源
 * @returns {object} log4js logger 实例
 */
const getLogger = (category = 'error', moduleName = 'access') => {
  const logger = log4js.getLogger(category);
  const prefix = `[${moduleName}]`;
  ['info', 'error', 'warn', 'debug'].forEach((level) => {
    const original = logger[level].bind(logger);
    logger[level] = (...args) => original(prefix, ...args);
  });

  return logger;
};

module.exports = {
  getLogger,
  log4js,
};