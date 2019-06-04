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

router.get('/test', async (ctx, next) => {
    post_body = {
        task_id: 2
    }
    let current_user = "hyx"
    let toastTask = await TaskModel.searchTaskById(post_body.task_id);
    ToastModel.createToast(toastTask.publisher, 11, 
                            ToastInfo.t11(toastTask.title, current_user), 
                            current_user, -1, post_body.task_id);
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
