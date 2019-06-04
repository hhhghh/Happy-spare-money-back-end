const TRModel = require('../modules/trModel');
// Get username from session.
const getUsernameFromCtx = require('./cookieController').getUsernameFromCtx;
const checkUndefined = require('../utils/url_params_utils').checkUndefined;
const FileController = require('../controller/fileController');
const path = require('path');
const TaskModel = require('../modules/taskModel');
const ToastModel = require('../modules/toastModel');
require('../config/basicStr');

class TRController {
    /**
     * 创建team
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async recieveATask(ctx) {
        let post_body = ctx.request.body
        let result = undefined
        let required_param_list = ['task_id']
        if (checkUndefined(post_body, required_param_list)) {
            let current_user = await getUsernameFromCtx(ctx)
            if (current_user == -1 || current_user == -2) {
                result = {
                    code: 401,
                    msg: "Should login first",
                    data: []
                }
            } else {
                username = current_user;
                task_id = post_body.task_id;
                try {
                    await TRModel.receiveTask(username, task_id);
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
                            data: []
                        }
                    } else {
                        console.log(err)
                        result = {
                            code: 500,
                            msg: "Params wrong, or constrait did not pass (already recieved, cannot receive again).",
                            data: err.message
                        }
                    }
                }
            }  
        } else {
            result = {
                code: 412,
                msg: "Params wrong, API denied",
                data: []
            }
        }

        ctx.response.status = result.code
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }

        let publisher = await TaskModel.searchTaskById(post_body.task_id).publisher
        ToastModel.createToast(publisher, 10, "", post_body.username, -1, post_body.task_id);
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

    static async deleteTR(ctx) {
        let current_user = await getUsernameFromCtx(ctx)
        let post_body = ctx.query
        let result = undefined
        let required_param_list = ['task_id']
        if (checkUndefined(post_body, required_param_list)) {
            try {
                let data = await TRModel.deleteTR(current_user, post_body.task_id)
                result = {
                    code: 200, 
                    msg: 'Success',
                    data: data
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: 'Failed, database wrong.',
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params wrong, API denied",
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

    static async confirmComplement(ctx) {
        let result = undefined
        let post_body = ctx.request.body
        let current_user = getUsernameFromCtx(ctx)
        if (current_user == -1 || current_user == -2 || current_user == undefined || current_user == null) {
            response(ctx, 403, "Please login first", []);
            return;
        }
        if (post_body.task_id &&
            post_body.score) {
            try {
                let data = await TRModel.comfirm_complement(current_user, 
                                                            post_body.task_id, 
                                                            post_body.score);
                result = {
                    code: 200, 
                    msg: 'Success',
                    data: data
                }
            } catch (err) {
                console.log(err)
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err.message
                }
            }
        } else {
            result = {
                code: 412,
                msg: 'Param is not enough',
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

    static async completeTask(ctx) {
        let post_body = ctx.request.body
        let result = undefined
        let current_user = getUsernameFromCtx(ctx)
        if (current_user == -1 || current_user == -2 || current_user == undefined || current_user == null) {
            response(ctx, 403, "please login first", []);
            return;
        }
        if (post_body.task_id != undefined) {
            try {
                post_body.username = current_user
                result = await TRModel.accepter_make_complement(post_body)
                result = {
                    code: 200,
                    msg: "Success",
                    data: result
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err.message
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params wrong...",
                data: []
            }
        }
        response(ctx, result.code, result.msg, result.data);
    }
 
    static async searchTR(ctx) {
        let query = ctx.query
        let result = undefined
        if (query.task_id && query.username) {
            try {
                result = await TRModel.searchTR(query.username, query.task_id)
                result = {
                    code: 200, 
                    msg: "Success",
                    data: result
                }
            } catch (err) {
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err.message
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params is not enough",
                data: []
            }
        }
        response(ctx, result.code, result.msg, result.data);
    }

    static async submitQuestionnaire(ctx) {
        let serverPath = path.join(__dirname, '../static/uploads/');
        // 获取上存文件
        let result = await FileController.uploadFile(ctx, {
            fileType: 'questionnaire',
            path: serverPath
        });

        let fileUrl = defaultIP + '/uploads' + result.imgPath.split('.')[0] + '.json'

        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: {
                fileUrl: fileUrl
            }
        };
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