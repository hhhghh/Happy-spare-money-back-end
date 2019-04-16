const TaskModel = require('../modules/taskModel');

class TaskController {
    /**
     * 创建team
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        // 接收客服端
        let req = ctx.request.body;
        if (req.team_name
            && req.description
        ) {
            try {
                const ret = await TeamModel.createTeam(req);
                const data = await TeamModel.getTeamDetail(ret.team_id);

                ctx = response(ctx, 200, '查询成功', data)

            } catch (err) {
                ctx = response(ctx, 412, '创建team失败', err)
            }
        } else {
            ctx = response(ctx, 416, '参数不齐全')            
        }

    }

    /**
     * 获取文章详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async searchTask(ctx) {
        let task_id = ctx.params.task_id;
        if (task_id) {
            try {
                // 查询team详情模型
                let data = await TaskModel.getTaskDetail(task_id);
                ctx = response(ctx, 200, '查询成功', data);
            } catch (err) {
                ctx = response(ctx, 412, '插叙失败', err)
            }
        } else {
            ctx = response(ctx, 416, '需要task_id', err)
        }
    }
}


let response = (ctx, code, msg, data = null) => {
    ctx.response.status = code;
    ctx.body = {
        code: code,
        msg: msg,
        data: data
    };
    return ctx;
}


module.exports = TaskController;