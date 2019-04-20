const router = require('koa-router')();
const TeamController = require('../controller/teamController');

router.prefix('/api/team');

router.post('/create/', TeamController.createGroup);

router.get('/get/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader) {
        result = await TeamController.isGroupLeader(query_params.team_id, query_params.leader)
    } else if (query_params.team_id && query_params.member_username) {
        result = await TeamController.isGroupMember(query_params.team_id, query_params.member_username)
    } else if (query_params.team_name) {
        result = await TeamController.getGroupByGroupName(query_params.team_name)
    } else if (query_params.tag) {
        result = await TeamController.getGroupByTag(query_params.tag)
    } else if (query_params.member_username) {
        result = await TeamController.getGroupByUsername(query_params.member_username)
    } else if (query_params.group_id) {
        let team_id = query_params.group_id;
        result = await TeamController.getMembersByGroupId(team_id)
    } else if (query_params.team_id) {
        result = await TeamController.getGroupByGroupId(query_params.team_id)
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
});

router.get('/add/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.username) {
        result = await TeamController.addUserToGrope(query_params.team_id, query_params.leader, query_params.username)
    } else if (query_params.team_id && query_params.username) {
        result = await TeamController.addUserToGrope2(query_params.team_id, query_params.username)
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
});

router.get('/delete/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.username) {
        result = await TeamController.deleteUserFromGrope(query_params.team_id, query_params.leader, query_params.username)
    } else if (query_params.team_id && query_params.username) {
        result = await TeamController.deleteUserFromGrope2(query_params.team_id, query_params.username)
    } else if (query_params.team_id && query_params.leader) {
        result = await TeamController.deleteGroup(query_params.team_id, query_params.leader);
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
});

router.get('/update/', async (ctx) => {
    let query_params = ctx.query;
    let result = null;
    if (query_params.team_id && query_params.leader && query_params.username) {
        result = await TeamController.updateTeamLeader(query_params.team_id, query_params.leader, query_params.username)
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
