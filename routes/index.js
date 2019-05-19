const router = require('koa-router')();

const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const models = require('../table/all_tables')

const Op = Sequelize.Op

router.get('/test', async (ctx, next) => {
    models.Task.hasMany(models.TR)
    models.TR.belongsTo(models.Task, {foreignKey: 'task_id'})
    sequelize.sync()
    tr = await models.TR.create({
        task_id: 2,
        username: 'hyx',
        state: 2
    })
    console.log(tr)
    ctx.body = tr
    tr.getTask().then(associatedTasks => {
        console.log(associatedTasks)
        ctx.body = associatedTasks
    })
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
