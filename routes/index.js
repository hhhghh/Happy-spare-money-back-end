const router = require('koa-router')();

const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const models = require('../table/all_tables')
const TRModel = require('../modules/trModel');
const checkUndefined = require('../utils/url_params_utils').checkUndefined;
const FileController = require('../controller/fileController');
const path = require('path');
const TaskModel = require('../modules/taskModel');
const ToastModel = require('../modules/toastModel');
const ToastInfo = require('../utils/toast_info');
const Op = Sequelize.Op

router.post('/test', async (ctx, next) => {
    let post_body = ctx.request.body
    if (post_body.username instanceof Array) {
        data = await TRModel.batch_confirm_complement(post_body.username, 
                                                      post_body.task_id, 
                                                      post_body.score);
    } else {
        data = await TRModel.comfirm_complement(post_body.username, 
                                                post_body.task_id, 
                                                post_body.score);
    }
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
