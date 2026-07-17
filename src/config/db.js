const Sequelize = require('sequelize');
const { getLogger } = require('../utils/logger');
const logger = getLogger('error', 'db');
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    pool: {
      max: Number(process.env.DB_MAX_CONNECTIONS) || 10,
      min: Number(process.env.DB_MIN_CONNECTIONS) || 0,
      acquire: Number(process.env.DB_ACQUIRE_TIMEOUT) || 30000,
      idle: Number(process.env.DB_IDLE_TIMEOUT) || 10000
    }
  });

sequelize.authenticate()
  .then(() => {
    logger.info('数据库连接成功');
  })
  .catch(err => {
    logger.error('数据库连接失败:', err);
  });
sequelize.sync()
  .then(() => {
    logger.info('数据库同步成功');
  })
  .catch(err => {
    logger.error('数据库同步失败:', err);
  });
module.exports = sequelize;