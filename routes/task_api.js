const router = require('koa-router')()
const task_controller = require('../controller/taskController')
const tr_controller = require('../controller/trController')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.prefix('/api/v1/task')

// 获得TASK，通过range, type, username
router.get('/', task_controller.searchTask);
router.get('/findByPublisher', task_controller.searchTaskByUserRelease)
router.get('/findByTaskId', task_controller.searchTaskById)
router.get('/findByAccepter', task_controller.searchTaskByAccepter)
router.get('/accepter', tr_controller.searchByTaskId)

router.post('/complement', tr_controller.completeTask)
router.post('/comfirm', tr_controller.confirmComplement)
router.post('/', task_controller.releaseTask);

router.del('/', task_controller.deleteTaskByTaskID);


router.get('/state', async (ctx) => {
    let query = ctx.query
    let result = undefined
    if (query.task_id && query.username) {
        let query_terms = {
            username: query.username,
            task_id: query.task_id
        }
        result = await tr_controller.searchTRBySomeRestriction(query_terms)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough"
        }
    }
    ctx = response(ctx, result)
})

router.get('/acceptance', async (ctx) => {
    let query = ctx.query
    let result = undefined
    if (query.task_id && query.username) {
        let query_terms = {
            username: query.username,
            task_id: query.task_id
        }
        result = await tr_controller.searchTRBySomeRestriction(query_terms)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough"
        }
    }
    ctx = response(ctx, result)
}) 

router.post('/acceptance', async (ctx) => {
    let post_body = ctx.request.body
    let result = undefined
    if (post_body.username && post_body.task_id) {
        result = await tr_controller.recieveATask(post_body.username, 
            post_body.task_id)
    } else {
        result = {
            code: 412,
            msg: "Params wrong, API denied",
            data: []
        }
    }
    ctx = response(ctx, result)
})

router.del('/acceptance', async (ctx) => {
    let post_body = ctx.query
    let result = undefined
    if (post_body.task_id && post_body.username) {
        result = await tr_controller.deleteTR(post_body.username, post_body.task_id)
    } else {
        result = {
            code: 412,
            msg: "Params wrong, API denied"
        }
    }
    ctx = response(ctx, result)
})

function response(ctx, result) {
    ctx.response.code = result.code
    ctx.body = {
        code: result.code,
        msg : result.msg,
        data: result.data,
    }
}

module.exports = router
