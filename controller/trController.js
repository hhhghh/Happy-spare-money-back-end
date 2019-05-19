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
            let ret = await TRModel.receiveTask(username, task_id);
            let data = await TRModel.searchByTaskId(task_id);
            result = {
                code: 200,
                msg: "Success, result as below",
                data: data
            }
        } catch (err) {
            if (err.name == 'SequelizeUniqueConstraintError') {
                result = {
                    code: 500,
                    msg: "Constrait error, cannot recieve a task twice",
                    data: err
                }
            } else if (err.name == 'SequelizeForeignKeyConstraintError') {
                result = {
                    code: 500,
                    msg: "No such a task",
                    data: err
                }
            } else {
                console.log(err)
                result = {
                    code: 500,
                    msg: "Params wrong, or constrait did not pass (already recieved, cannot receive again).",
                    data: err
                }
            }
        }
        return result
    }

    /**
     * 获取文章详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async searchByTaskId(ctx) {
        let result = undefined
        if (ctx.query.task_id) {
            let task_id = ctx.query.task_id
            try {
                let data = await TRModel.searchByTaskId(task_id);
                result = {
                    code: 200, 
                    msg: 'Success',
                    data: data
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: 'Failed',
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params not enough",
                data: []
            }
        }

        ctx.response.status  =  result.code
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
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

    static async confirmComplement(ctx) {
        let result = undefined
        let post_body = ctx.request.body
        console.log(post_body)
        if (post_body.username &&
            post_body.task_id &&
            post_body.score) {
            try {
                let data = await TRModel.comfirm_complement(post_body.username, 
                                                            post_body.task_id, 
                                                            post_body.score);
                result = {
                    code: 200, 
                    msg: 'Success',
                    data: data
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: 'Param is not enough',
                data: []
            }
        }

        ctx.response.status  =  result.code
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
    }

    static async completeTask(ctx) {
        let post_body = ctx.request.body
        let result = undefined
        
        if (post_body.task_id
            && post_body.username) {
            try {
                result = await TRModel.accepter_make_complement(post_body.username, post_body.task_id)
                result = {
                    code: 200,
                    msg: "Success",
                    data: result
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params wrong...",
                data: []
            }
        }

        ctx.response.status = result.code
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
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


module.exports = TRController;