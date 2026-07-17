const Router = require('@koa/router');
const router = new Router();
const { getLogger } = require('../utils/logger');
const logger = getLogger('access', 'user');
const { 
  register, 
  login, 
  updateUser, 
  deleteUser, 
  getUserList 
} = require('../controller/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/list', getUserList);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
module.exports = router;