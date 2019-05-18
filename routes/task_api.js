const router = require('koa-router')()
const task_controller = require('../controller/taskController')
const tr_controller = require('../controller/trController')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.prefix('/api/v1')

// 获得TASK，通过range, type, username
router.get('/task', task_controller.searchTask);

// 发布任务, 提供所有必要信息
router.post('/task', task_controller.releaseTask);

router.del('/task', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    if (query_params.task_id) {
        result = await task_controller.deleteTaskByTaskID(query_params.task_id)
        // Need authorize...
        // TODO...
        // 
        // 
    } else {
        result = {
            code: 412,
            msg: "Params wrong, API denied"
        }
    }
    ctx = response(ctx, result)
})

router.get('/task/findByPublisher', task_controller.searchTaskByUserRelease)

router.get('/task/findByTaskId', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    if (query_params.task_id) {
        let query_terms = {
            task_id: query_params.task_id
        }
        result = await task_controller.searchTaskById(query_terms.task_id)
        console.log(result)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough..."
        }
    }
    ctx = response(ctx, result)
})

router.get('/task/findByAccepter', task_controller.searchTaskByAccepter)

router.get('/task/state', async (ctx) => {
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

router.get('/task/acceptance', async (ctx) => {
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

router.post('/task/acceptance', async (ctx) => {
    let post_body = ctx.request.body
    let result = undefined
    if (post_body.username && post_body.task_id) {
        result = await tr_controller.recieveATask(post_body.username, 
            post_body.task_id)
    } else {
        result = {
            code: 412,
            msg: "Params wrong, API denied"
        }
    }
    ctx = response(ctx, result)
})

router.del('/task/acceptance', async (ctx) => {
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

router.post('/task/complement', tr_controller.completeTask)

router.post('/task/comfirm', tr_controller.confirmComplement)

router.get('/task/accepter', tr_controller.searchByTaskId)

function response(ctx, result) {
    ctx.response.code = result.code
    ctx.body.data = result.data
    ctx.body.code = result.code
    ctx.body.msg = result.msg
}

module.exports = router
