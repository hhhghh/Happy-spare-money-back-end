const router = require('koa-router')();

const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const models = require('../table/all_tables')

const Op = Sequelize.Op

router.get('/test', async (ctx, next) => {
    let re = await models.Task.findByPk(4, {
        attributes: ['publisher']
    });
    console.log(re);
    ctx.body = re;
})

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

module.exports = router;
