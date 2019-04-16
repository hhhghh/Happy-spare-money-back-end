const router = require('koa-router')()
const TaskController = require('../controller/taskController')

router.prefix('/api/task')

router.post('/', async (ctx) => {
    await TaskController.releaseTask()
})

/**
 * static async searchTaskByType(ctx) ;
 * eg: /api/task?type=1
 * 
 * static async searchTaskByMoney(ctx) ;
 * eg: /api/task?money_low=100&money_high=1000
 * 
 * static async searchTaskByUserRelease(ctx) ;
 * eg: /api/task?user_release=testusername
 */ 


router.get('/', async (ctx) => {
    let query_params = ctx.query
    let result = null
    if (query_params.task_id) 
    {
        result = await TaskController.searchTaskById(query_params.task_id)
    }
    else if (query_params.type) 
    {
        result = await TaskController.searchTaskByType(query_params.type)
    } 
    else if (query_params.money_low && query_params.money_high) 
    {
        result = await TaskController.searchTaskByMoney(query_params.money_low, query_params.money_high)
    } 
    else if (query_params.user_release) 
    {
        result = await TaskController.searchTaskByUserRelease(query_params.user_release)
    }
    else 
    {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
})


let response = (ctx, result) => {
    ctx.response.status = result.code;
    ctx.body = {
        code: result.code,
        msg: result.msg,
        data: result.data
    };
    return ctx;
}

module.exports = router
