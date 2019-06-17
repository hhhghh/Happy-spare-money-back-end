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
const UserModel = require('../modules/userModel');

router.post('/test', async (ctx, next) => {
    let post_body = ctx.request.body
    let current_user = 'hyx'
    let result = undefined
    let post_data = {
        title: post_body.title,
        introduction: post_body.introduction,
        money: post_body.money,
        score: post_body.score,
        max_accepter_number: post_body.max_accepter_number,
        publisher: current_user, // only session
        type: post_body.type,
        starttime: post_body.starttime,
        endtime: post_body.endtime,
        content: post_body.content,
        questionnaire_path: post_body.questionnaire_path
    }
    try {
        result = await TaskModel.createTask(post_data, post_body.range)
        let task_id = result.get('task_id')
        console.log(task_id)        
        let task_money = (await TaskModel.searchTaskById(task_id)).get('money');
        console.log(task_money)
        await UserModel.updateUserMoney(current_user, -task_money);
        
        result = {
            code: 200,
            msg: "Success",
            data: result
        }
        
    } catch (err) {
        result = {
            code: 500,
            msg: "Failed",
            data: err.message
        }
        console.log(err)
    }

    ctx.response.status = result.code
    ctx.body = {
        code: result.code,
        msg: result.msg,
        data: result.data
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
