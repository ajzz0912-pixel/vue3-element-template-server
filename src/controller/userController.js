const User = require('../model/user');
const { ValidationError } = require('sequelize');
const { getLogger } = require('../utils/logger');
const logger = getLogger('error', 'userController');
const md5 = require('../utils/md5');
const { generateToken, verifyToken } = require('../utils/jwt');

const findUserByUsername = async (username) => {
  if (!username) {
    return null;
  }
  const user = await User.findOne({ where: { username } });
  return user;
};

const findUserById = async (id) => {
  if (!id) {
    return null;
  }
  const user = await User.findOne({where: {id}});
  return user;
};

const register = async (ctx) => {
  const { username, password, email } = ctx.request.body;
  logger.log(`register: username: ${username}, password: ${password}, email: ${email}`);

  if (!username) {
    ctx.body = { code: 500, message: 'username不能为空' };
    return;
  }
  if (!password) {
    ctx.body = { code: 500, message: 'password不能为空' };
    return;
  }
  if (!email) {
    ctx.body = { code: 500, message: 'email不能为空' };
    return;
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    ctx.body = {
      code: 402,
      message: '用户已经存在！',
    };
    return;
  }
  try {
    await User.create({ username, password, email });
    logger.info(`User ${username} created successfully`);
    ctx.body = {
      code: 200,
      message: '注册成功！'
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.body = {
        code: 500,
        message: error.errors[0]?.message || '参数校验失败',
      };
      return;
    }
    logger.error(`Error creating user: ${error.message}`);
    ctx.body = {
      code: 500,
      message: error.message || '用户创建失败',
    };
  }
};

const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username) {
    ctx.body = { code: 500, message: 'username不能为空' };
    return;
  }
  if (!password) {
    ctx.body = { code: 500, message: 'password不能为空' };
    return;
  }

  const user = await findUserByUsername(username);
  if (!user) {
    ctx.body = {
      code: 400,
      message: '用户不存在！',
    };
    return;
  }
  if (user.password !== md5(password)) {
    ctx.body = {
      code: 500,
      message: '密码错误！',
    };
    return;
  }
  const token = generateToken({ id: user.id });
  const userData = user.toJSON();
  delete userData.password;
  ctx.body = {
    code: 200,
    message: '登录成功！',
    token: token,
    data: {...userData}
  };
  return;
};

const getUserList = async (ctx) => {
    const { page = 1, pageSize = 10 } = ctx.request.body;
    const userList = await User.findAll({ offset: (page - 1) * pageSize, limit: pageSize, attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']]
    });
    if (userList.length === 0) {
        ctx.body = {
            code: 200,
            data: []
        };
        return;

    }
    ctx.body = { 
        code: 200, 
        data: userList,
        total: userList.length,
        page: page,
        pageSize: pageSize
    };
};

const updateUser = async (ctx) => {
    const { id } = ctx.params;
    const { username, password, email } = ctx.request.body;
    const existingUser = await findUserById(id);
    if (!existingUser) {
        ctx.body = {
            code: 500,
            message: '用户不存在！',
        };
        return;
    }
    try {
        const updateData = { username, email };
        if (password) {
            updateData.password = password;
        }
        //使用individualHooks: true 触发单个实例的 hooks（如密码加密）
        await User.update(updateData, { where: { id }, individualHooks: true });
        ctx.body = {
            code: 200,
            message: '用户更新成功！'
        };
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        ctx.body = {
            code: 500,
            message: error.message || '用户更新失败',
        };
    }
    
};

const deleteUser = async (ctx) => {
    const { id } = ctx.params;
    const existingUser = await findUserById(id);
    if (!existingUser) {
        ctx.body = {
            code: 500,
            message: '用户不存在！',
        };
        return;
    }
    try {
        await User.destroy({ where: { id } });
        ctx.body = { 
            code: 200,
            message: '用户删除成功！' 
        };
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        ctx.body = {
            code: 500,
            message: error.message || '用户删除失败',
        };
    }
};

module.exports = {
    register,
    login,
    updateUser,
    deleteUser,
    getUserList
};