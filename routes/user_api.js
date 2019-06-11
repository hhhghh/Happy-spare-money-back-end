const router = require('koa-router')()
const UserController = require('../controller/userController')

router.prefix('/api/v1/user')

router.post('/create', UserController.register);

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.post('/score', UserController.updateUserScore);

router.post('/userblacklist', UserController.UserBlacklistUser);

router.post('/teamblacklist', UserController.teamBlacklistOrg);

router.post('/usercancelblack', UserController.UserCancelBlack);

router.post('/teamcancelblack', UserController.teamCancelBlack);

router.post('/getteammembersavatat', UserController.getTeamMembersAvatar);

router.post('/setRate', UserController.setRate);

router.post('/verifyPassword', UserController.verifyPassword);

router.put('/update', UserController.updateUserInfo);

router.put('/updateAvatar', UserController.updateAvatar);

router.get('/getPersonalInfo', async (ctx) => {
    if (!ctx.session.username) {
        ctx.status = 401;
        ctx.body = {
            code: 401,
            msg: '请登录！'
        };
        return;
    }
    result = await UserController.getUserInfo(ctx.session.username);
    ctx = response(ctx, result);
});

router.get('/getuser', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getUserInfo(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/getorg', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getOrgInfo(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/getavatar', async(ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getUserAvatar(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);    
});

router.get('/getAcceptedFinishedTasks', async(ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getAcceptedFinishedTasks(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null    
        }
    }
    ctx = response(ctx, result)
})

router.get('/getPublishedWaitedTasks', async(ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getPublishedWaitedTasks(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null    
        }
    }
    ctx = response(ctx, result)
})

router.get('/getPublishedFinishedTasks', async(ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.username) {
        result = await UserController.getPublishedFinishedTasks(query_params.username);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null    
        }    
    }
    ctx = response(ctx, result)
})

router.get('/getCanPublishTasksOrg', async(ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.teamId) {
        result = await UserController.getCanPublishTasksOrg(query_params.teamId);
    }
    else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
})

router.get('/deposit', async(ctx) => {
    let query_params = ctx.query
    let result = null
    if (query_params.amount) {
        result = await UserController.updateUserMoney(ctx);   
    }
    else {
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
};

module.exports = router;