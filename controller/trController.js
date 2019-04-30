const TRModel = require('../modules/trModel');

class TRController {
    /**
     * 创建team
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async recieveATask(username, task_id) {
        let result
        try {
            const ret = await TRModel.receiveTask(username, task_id);
            const data = await TRModel.searchByTaskId(task_id);
            result = {
                code: 200,
                msg: "Success, result as below",
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: "Params wrong, or constrait did not pass (already recieved, cannot receive again).",
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
    static async searchByTaskId(task_id) {
        let result = undefined
        try {
            let data = await TRModel.getTRByTaskId(task_id);
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

    /**
     * 获取文章详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async searchByUsername(username) {
        let result = undefined
        try {
            let data = await TRModel.searchTRByUsername(username);
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

    static async deleteTR(username, task_id) {
        let result = undefined
        try {
            let data = await TRModel.deleteTR(username, task_id)
            result = {
                code: 200, 
                msg: 'Seccuss',
                data: data
            }
        } catch (err) {
            result = {
                code: 412,
                msg: 'Failed, check your params',
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


module.exports = TRController;