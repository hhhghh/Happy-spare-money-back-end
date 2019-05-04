let checkParamsAndConvert = (query_params, which) => {
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
            username: query.username
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
        && post_body.score && post_body.number && post_body.publisher 
        && post_body.state && post_body.type) {
        let post_data = {
            title: post_body.title,
            introduction: post_body.introduction,
            money: post_body.money,
            score: post_body.score,
            number: post_body.number,
            publisher: post_body.publisher,
            state: post_body.state,
            type: post_body.type
        }
        result = await task_controller.releaseTask(post_data)
    } else {
       result = {
           code: 412,
           msg: "Params are not enough, need [title, introduction, money, score, number, publisher, state, type]",
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
    let query_params 
    let result = undefined
    if (query_params.username) {
        let query_terms = {
            username: query_params.username
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
        result = await tr_controller.searchTaskByAccepter(query_terms.username)
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
    let query_params = ctx.query
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
        result = await task_controller.deleteTR(post_body.username, post_body.task_id)
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
        result = tr_controller.confirmComplement(username, task_id, score)
    } else {
        result = {
            code: 412,
            msg: "Params wrong..."
        }
    }
    ctx = response(ctx, result)
})