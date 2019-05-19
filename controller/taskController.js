const TaskModel = require('../modules/taskModel');

class TaskController {
    /**
     * Use range, type and username to get a task, which is the most 
     * common useful API, just name it `searchTask`
     *  1. type:        the type of the task, see task table
     *  2. range:       
     *      * 'ALL'
     *      * Group ids, such as `1`, or `1,2,3`
     *  3. username:    Can be seen by this user. Controller will delete all tasks shielded by the user.
     * 
     * @param ctx Just ctx of KOA
     * @author Gongzq5
     */
    static async searchTask(ctx) {
        let query = ctx.query, result = undefined;
        // 检查参数
        if (query.range && query.type && query.username) {
            try {
                result = await TaskModel.searchTask(query)
                result = {
                    code: 200,
                    msg: 'Success',
                    data: result
                }
            } catch (err) {
                console.log(err)
                result = {
                    code: 500,
                    msg: "Search wrong, please contact the coder",
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params wrong, please check."
            }
        }

        ctx.response.status = result.code
        ctx.body = {
            code: result.code,
            msg: result.msg,
            data: result.data
        }
    }
    
    /**
     * 创建team
     * title, introduction, money, score, number, publisher, state, type, starttime, endtime
     */
    static async releaseTask(ctx) {
        let post_body = ctx.request.body
        let result = undefined
        if (post_body.title && post_body.introduction && post_body.money 
            && post_body.score && post_body.max_accepter_number && post_body.publisher 
            && post_body.type && post_body.range) {
            let post_data = {
                title: post_body.title,
                introduction: post_body.introduction,
                money: post_body.money,
                score: post_body.score,
                max_accepter_number: post_body.max_accepter_number,
                publisher: post_body.publisher,
                state: 0,
                type: post_body.type,
                starttime: post_body.starttime,
                endtime: post_body.endtime,
                content: post_body.content,
            }
            try {
                result = await TaskModel.createTask(post_data, post_body.range)
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
                console.log(err)
            }
        } else {
            result = {
                code: 412,
                msg: "Params are not enough, need [title, introduction, money, score, max_accepter_number, publisher, type]",
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

    /**
     * 获取文章详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async searchTaskById(ctx) {
        let query_params = ctx.query
        let result = undefined
        if (query_params.task_id) {
            try {
                result = await TaskModel.searchTaskById(query_params.task_id);
                result = {
                    code: 200,
                    msg: "Success",
                    data: result
                }
            } catch (err) {
                console.log(err)
                result = {
                    code: 500,
                    msg: "Failed",
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params is not enough...",
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
                code: 500,
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
                code: 500,
                msg: '查询失败',
                data: err
            }
        }
        return result
    }

    static async searchTaskByUserRelease(ctx) {
        let query_params = ctx.query
        console.log(ctx.query.publisher)
        let result = undefined
        if (query_params.publisher) {
            try {
                result = await TaskModel.searchTaskByUserRelease(query_params)
                result = {
                    code: 200, 
                    msg: 'Success',
                    data: result
                }
            } catch (err) {
                console.log(err)
                result = {
                    code: 500,
                    msg: 'Failed',
                    data: err
                }
            }
        } else {
            result = {
                code: 412,
                msg: "Params is not enough...",
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
                code: 500,
                msg: '查询失败，请检查参数',
                data: err
            }
        }
        return result
    }

    static async deleteTaskByTaskID(task_id) {
        let result
        try {
            let data = await TaskModel.deleteTaskByTaskID(task_id)
            result = {
                code: 200, 
                msg: 'Success',
                data: data
            }
        } catch (err) {
            result = {
                code: 500,
                msg: '查询失败，请检查参数',
                data: err
            }
        }
        return result
    }

    static async searchTaskByAccepter(ctx) {
        let query_params = ctx.query
        let result = undefined
        if (query_params.username) {
            try {
                result = await TaskModel.searchTaskByAccepter(query_params)
                result = {
                    code: 200, 
                    msg: 'Success',
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
                msg: "Params is not enough...",
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

    // static async acceptTask(ctx) {
    //     let post_body = ctx.request.body
    //     let result = undefined

    //     if (post_body.username && post_body.task_id) {
    //         result = await tr_controller.recieveATask(post_body.username, 
    //             post_body.task_id)
    //     } else {
    //         result = {
    //             code: 412,
    //             msg: "Params wrong, API denied",
    //             data: []
    //         }
    //     }

    //     ctx.response.status = result.code
    //     ctx.body = {
    //         code: result.code,
    //         msg: result.msg,
    //         data: result.data
    //     }
    // }
}

/**
 * 检查 `query_params[which]` 参数项
 * * 若为 `1,2,3,4` 这种格式, 将其转化为数组
 * * 若为 `all`, 删除该项
 * 
 * @param query_params  JSON格式的查询字符串
 * @param which         检查的参数名称
 */
function checkParamsAndConvert(query_params, which) {
    if (query_params[which].toLowerCase() == 'all') {
        // 直接删去就好，无需任何限制
        delete query_params[which]
    } else if (query_params[which].indexOf(',') != -1) {
        // 说明是输入数组形式，改成 Op.or
        let term = query_params[which]
        term = term.split(',').map(Number)
        query_params[which] = term
        // {
        //     [Op.or]: term
        // }
    }
    return query_params
}

module.exports = TaskController;