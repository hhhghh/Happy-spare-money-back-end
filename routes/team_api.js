const router = require('koa-router')();
const TeamController = require('../controller/teamController');

router.prefix('/api/v1/team');

router.post('/', TeamController.createGroup);

router.put('/', TeamController.modifyGroup);

router.get('/Leader/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader) {
        result = await TeamController.isGroupLeader(query_params.team_id, query_params.leader)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/Member/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.member_username) {
        result = await TeamController.isGroupMember(query_params.team_id, query_params.member_username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/Name/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_name) {
        result = await TeamController.getGroupByGroupName(query_params.team_name)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/Label/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.label) {
        result = await TeamController.getGroupByTag(query_params.label)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/MemberName/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.member_username) {
        result = await TeamController.getGroupByUsername(query_params.member_username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.get('/Id/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id) {
        result = await TeamController.getGroupByGroupId(query_params.team_id)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result);
});

router.post('/Member/Invitation/', async (ctx) => {
    let query_params = ctx.request.body;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.user) {
        result = await TeamController.addUserToGrope(query_params.team_id, query_params.leader, query_params.user)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});

router.post('/Member/Addition/', async (ctx) => {
    let query_params = ctx.request.body;
    let result = null;
    if (query_params.team_id && query_params.username) {
        result = await TeamController.addUserToGrope2(query_params.team_id, query_params.username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});

router.post('/Leader/', async (ctx) => {
    let query_params = ctx.request.body;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.username) {
        result = await TeamController.updateTeamLeader(query_params.team_id, query_params.leader, query_params.username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});

router.del('/Member/Dislodge/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.username) {
        result = await TeamController.deleteUserFromGrope(query_params.team_id, query_params.leader, query_params.username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});

router.del('/Member/Departure/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.username) {
        result = await TeamController.deleteUserFromGrope2(query_params.team_id, query_params.username)
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});

router.del('/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader) {
        result = await TeamController.deleteGroup(query_params.team_id, query_params.leader);
    } else {
        result = {
            code: 400,
            msg: 'Wrong query param.',
            data: null
        }
    }
    ctx = response(ctx, result)
});


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
