const TaskModel = require('../modules/taskModel');

class TaskController {
    /**
     * 创建team
     * title, introduction, money, score, number, publisher, state, type, starttime, endtime
     */
    static async releaseTask(task_data) {
        if (!task_data.starttime) {
            task_data.starttime = new Date().toString();
        }
        let result = undefined
        try {
            const new_task = await TaskModel.createTask(task_data);
            const data = new_task.dataValues;
            result = {
                code: 200,
                msg: "查询成功",
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: "创建失败",
                data: err
            }
        }
        return result
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

    static async searchTaskByMoney(money) {
        let result
        try {
            let data = await TaskModel.getTaskByMoney(money[0], money[1]);
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

    static async searchTaskBySomeRestriction(restrictions) {
        let result
        try {
            let data = await TaskModel.getTaskByRestrict(restrictions);
            result = {
                code: 200, 
                msg: '查询成功',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败，请检查参数',
                data: err
            }
        }
        return result
    }

    static async deleteTask(task_id) {
        let result
        try {
            let data = await TaskModel.deleteTaskByTaskID(task_id)
            result = {
                code: 200, 
                msg: 'Success'
            }
        } catch (err) {
            result = {
                code: 412,
                msg: '查询失败，请检查参数',
                data: err
            }
        }
        return result
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