const Router = require('@koa/router');
const router = new Router({ prefix: '/api' });
const userRoutes = require('./user');
const roleRoutes = require('./role');

router.use('/user', userRoutes.routes(), userRoutes.allowedMethods());
router.use('/role', roleRoutes.routes(), roleRoutes.allowedMethods());

module.exports = router;