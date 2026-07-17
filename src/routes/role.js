const Router = require('@koa/router');
const router = new Router();

router.get('/', async ctx => {
  ctx.body = '/roles';
});

router.get('/:id', async ctx => {
  ctx.body = `/roles/${ctx.params.id}`;
});

module.exports = router;