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
                code: 500,
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
                code: 500,
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
                code: 500,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    static async searchTRBySomeRestriction(terms) {
        let result = undefined
        try {
            let data = await TRModel.searchTRByRestrict(terms)
            result = {
                code: 200,
                msg: "Success",
                data: data
            }
        } catch (err) {
            result = {
                code: 500,
                msg: "查询出错",
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
                code: 500,
                msg: 'Failed, database wrong.',
                data: err
            }
        }
        return result
    }

    static async confirmComplement(username, task_id, score) {
        let result = undefined
        try {
            let data = await TRModel.confirmComplement(username, task_id, score)
            result = {
                code: 200, 
                msg: 'Success',
                data: data
            }
        } catch (err) {
            result = {
                code: 401,
                msg: "失败，数据库未知错误",
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