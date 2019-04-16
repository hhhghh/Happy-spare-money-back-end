const router = require('koa-router')();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
});

const TeamController = require('../controller/teamController');
router.post('/team', TeamController.create);
router.get('/team/:team_id', TeamController.detail);

const UserController = require('../controller/userController');
router.post('/user', UserController.create);
router.get('/user/:username', UserController.detail);

module.exports = router;
