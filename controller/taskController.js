const TaskModel = require('../modules/taskModel');

class TaskController {
    /**
     * 创建team
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async releaseTask(ctx) {
        // 接收客服端
        let req = ctx.request.body;
        if (req.team_name
            && req.description
        ) {
            try {
                const ret = await TaskModel.createTask(req);
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
    static async searchTaskById(task_id) {
        let result
        try {
            let data = await TaskModel.getTaskDetail(task_id);
            result = {
                code: 200, 
                msg: '查询成功',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    static async searchTaskByType(type) {
        let result
        try {
            let data = await TaskModel.getTasksByType(type);
            result = {
                code: 200, 
                msg: '查询成功',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    static async searchTaskByMoney(money_low, money_high) {
        let result
        try {
            let data = await TaskModel.getTaskByMoney(money_low, money_high);
            result = {
                code: 200, 
                msg: '查询成功',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    static async searchTaskByUserRelease(username) {
        let result
        try {
            let data = await TaskModel.getTaskByUserRelease(username);
            result = {
                code: 200, 
                msg: '查询成功',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    // static async searchTaskByUserAccept(username) {
    //     let result
    //     try {
    //         let data = await TaskModel.getTaskByUserRelease(username);
    //         result = {
    //             code: 200, 
    //             msg: '查询成功',
    //             data: data
    //         }
    //     } catch (err) {
    //         result = {
    //             code: 412,
    //             msg: '查询失败',
    //             data: err
    //         }
    //     }
    //     return result
    // }
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