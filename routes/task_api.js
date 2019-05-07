const router = require('koa-router')()
const task_controller = require('../controller/taskController')
const tr_controller = require('../controller/trController')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.prefix('/api/v1')

// 获得TASK，通过range, type, username
router.get('/task', async (ctx) => {
    let query = ctx.query
    let result = undefined
    // range 检查是否需要转换为合适的参数形式
    if (query.range && 
        query.type &&
        query.username) {
        let query_terms = {
            range: query.range,
            type: query.type,
            // username: query.username
        }
        query_terms = checkParamsAndConvert(query_terms, "range")
        query_terms = checkParamsAndConvert(query_terms, "type")
        result = await task_controller.searchTaskBySomeRestriction(query_terms)
    } else {
        result = {
            code: 412,
            msg: "Params wrong, please check."
        }
    }
    ctx = response(ctx, result)
})

// 发布任务, 提供所有必要信息
router.post('/task', async (ctx) => {
    let post_body = ctx.request.body
    let result = undefined
    if (post_body.title && post_body.introduction && post_body.money 
        && post_body.score && post_body.max_accepter_number && post_body.publisher 
        && post_body.type) {
        let post_data = {
            title: post_body.title,
            introduction: post_body.introduction,
            money: post_body.money,
            score: post_body.score,
            max_accepter_number: post_body.max_accepter_number,
            publisher: post_body.publisher,
            state: "processing",
            type: post_body.type
        }
        result = await task_controller.releaseTask(post_data)
    } else {
       result = {
           code: 412,
           msg: "Params are not enough, need [title, introduction, money, score, max_accepter_number, publisher, type]",
       } 
    }
    ctx = response(ctx, result)
})

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

router.get('/task/findByPublisher', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    if (query_params.username) {
        let query_terms = {
            publisher: query_params.username
        }
        result = await task_controller.searchTaskBySomeRestriction(query_terms)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough..."
        }
    }
    ctx = response(ctx, result)
})

router.get('/task/findByTaskId', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    if (query_params.task_id) {
        let query_terms = {
            task_id: query_params.task_id
        }
        result = await task_controller.searchTaskBySomeRestriction(query_terms)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough..."
        }
    }
    ctx = response(ctx, result)
})

// 
router.get('/task/findByAccepter', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    if (query_params.username) {
        let query_terms = {
            username: query_params.username
        }
        result = await task_controller.searchTaskByAccepter(query_terms.username)
    } else {
        result = {
            code: 412,
            msg: "Params is not enough..."
        }
    }
    ctx = response(ctx, result)
})

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
        console.log("Username and task_id got")
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

router.post('/task/complement', async (ctx) => {
    let post_body = ctx.request.body
    let result = undefined
    
    if (post_body.task_id
        && post_body.username
        && post_body.score) {
        result = await tr_controller.confirmComplement(post_body.username, post_body.task_id, post_body.score)
    } else {
        result = {
            code: 412,
            msg: "Params wrong..."
        }
    }
    ctx = response(ctx, result)
})

/**
 * 检查 type 参数项
 * 可能输入为 1,2,3,4 这种格式，或all
 * 
 * @param query_params  JSON格式的查询字符串
 * @param which         检查的参数名称
 */
let checkParamsAndConvert  = (query_params, which) => {
    if (query_params[which].toLowerCase() == 'all') {
        // 直接删去就好，无需任何限制
        delete query_params[which]
    } else if (query_params[which].indexOf(',') != -1) {
        // 说明是输入数组形式，改成 Op.or
        let term = query_params[which]
        term = term.split(',').map(Number)
        query_params[which] = {
            [Op.or]: term
        }
    }
    return query_params
}

let response = (ctx, result) => {
    if (Number.isInteger(result.code)) 
        ctx.response.status = result.code
    else
        ctx.response.status = 500
    if (!result.data) {
        result.data = undefined
    }
    if (result.code == 200) {
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
    } else {
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
    }
    return ctx;
}

module.exports = router
