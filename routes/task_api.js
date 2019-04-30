const router = require('koa-router')()
const task_controller = require('../controller/taskController')
const tr_controller = require('../controller/trController')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.prefix('/api/task')

/**

GET: /api/task? <>
参数任意组合，符合要求即可

    GET: /task?type={:type}&range={:range}&username={:username}
    返回一个任务

    GET: /task?acceptable=true&type={type}&range={range}&state={state}&username={}
    获得任务

    GET: /task?release_user={username}
    获得任务

POST /api/task
发布任务

DEL /api/task?task_id={}
删除任务

*/

/**
 * 处理 Task 相关的 GET 请求
 */
router.get('/', async (ctx) => {
    let query_params = ctx.query
    let result = null
    // 检查 acceptable 提供一组额外的查询
    if (query_params.acceptable) {
        delete query_params.acceptable
        // 添加判断acceptable的代码
        // TODO
        // 
    }
    // range 检查是否需要转换为合适的参数形式
    if (query_params.range) 
        query_params = checkRangeAndConvert(query_params)
    
    result = await task_controller.searchTaskBySomeRestriction(query_params)
    ctx = response(ctx, result)
})

/**
 * 需要参数
 * title, introduction, money, score, number, publisher, state, type
 */
router.post('/', async (ctx) => {
    let post_data = ctx.request.body
    let result = undefined
    if (post_data.title && post_data.introduction && post_data.money 
        && post_data.score && post_data.number && post_data.publisher 
        && post_data.state && post_data.type) {
            result = await task_controller.releaseTask(post_data)
    } else {
       result = {
           code: 412,
           msg: "参数列表不完整"
       } 
    }
    ctx = response(ctx, result)
})

/**
 * 取消任务
 * POST: 删除一个任务
 */
router.del('/', async (ctx) => {
    let query_params = ctx.query
    let result = undefined
    console.log(query_params)
    if (query_params.task_id /** 这里要更改为判断取消任务的条件 */) {
        result = await task_controller.deleteTask(query_params.task_id)
        if (result.code == 412) {
            console.log(result)
        }
    } else {
        result = {
            code: 412,
            msg: "Params wrong, API denied"
        }
    }
    ctx = response(ctx, result)
})

// router.get('/task_state', async (ctx) => {
//     let query_params = ctx.query
//     let result = undefined
//     if (query_params.task_id && query_params.username) {
//         result = await task_controller.searchTaskState(query_params.task_id, query_params.username)
//     } else {
//         result = {
//             code: 412,
//             msg: "Params wrong, API denied"
//         }
//     }
// })

/**
 * 检查 range 参数项，并返回可供查询的range
 * @param {*} range 可能输入为 1,2,3,4 这种格式，或all
 */
let checkRangeAndConvert = (query_params) => {
    if (query_params.range.toLowerCase() == 'all') {
        // 直接删去就好，无需任何限制
        delete query_params.range
    } else if (query_params.range.indexOf(',') != -1) {
        // 说明是输入数组形式，改成 Op.or
        let range = query_params.range
        range = range.split(',').map(Number)
        query_params.range = {
            [Op.or]: range
        }
    }
    return query_params
}



let response = (ctx, result) => {
    ctx.response.status = result.code;
    if (result.code == 200) {
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
    } else {
        ctx.body = {
            code: result.code,
            msg: result.msg
        }
    }
    return ctx;
}



module.exports = router
