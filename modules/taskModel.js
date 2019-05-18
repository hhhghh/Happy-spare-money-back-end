const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const models = require('../table/all_tables')

const Op = Sequelize.Op

models.Task.sync({force: false});

class TaskModel {
    /**
     * 创建 task 模型
     * @param data
     * @returns {Promise<*>}
     */
    static async createTask(data) {
        return await models.Task.create({
            task_id: data.task_id,
            title: data.title,
            introduction: data.introduction,
            money: data.money,
            score: data.score,
            number: data.number,
            publisher: data.publisher,
            state: data.state,
            type: data.type,
            starttime: data.starttime,
            endtime: data.endtime,
            content: data.content,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        })
    }

    /**
     * Use range, type and username to get a task, which is the most 
     * common useful API, just name it `searchTask`
     * @param restriction.type:        the type of the task, see task table
     * @param restriction.range:       either
     *                                  
     * - `ALL`, will search in all groups
     * - Group ids, such as `1`, or `[1,2,3]`
     *  
     * @param restriction.username:    Can be seen by this user. Controller will delete all tasks shielded.
     */
    static async searchTask(restriction) {
        /**
         * 1. Search in `TR` by group id
         * 2. Search in `Task` by type
         * 3. Delete shielded tasks
         */
        // let tr_where, task_where;
        restriction = checkParamsAndConvert(restriction, ['range', 'type'])

        let task_ids = await models.TeamTask.findAll({
            where: {
                team_id: restriction.range,
                isolate: false
            },
            attributes: ['task_id'],
            raw: true
        });

        task_ids = task_ids.map((item) => {
            return item.task_id
        });


        if (task_ids.length == 0) {
            // No task can be found, then reutrn []
            return [];
        } 

        let tasks = await models.Task.findAll({
            where: {
                task_id: {
                    [Op.or]: task_ids
                },
                type: restriction.type
            },
            include: [{
                model: models.User,
                attributes: ['username', 'avatar']
            }]
        });

        // find tasks that not be shield be the user. using piu table
        // 奇奇怪怪的屏蔽，回头看情况再写吧……
        return tasks;
    }

    /**
     * 查询取 task 详情数据
     * @returns {Promise<Model>}
     * @param task_id
     */
    static async getTaskDetail(task_id) {
        return await models.Task.findOne({
            where: {
                task_id: task_id
            }
        })
    }

    /**
     * 查询可接受的任务列表
     * @param username username of the user who want to search
     */
    static async getAcceptableTaskList(username) {
        return await models.Task.findAll({
            where: {
                state: 'in_progress'
            }
        })
    }

    /**
     * 查询可接受的任务列表
     * @param username username of the user who want to search
     */
    static async getTasksByType(type) {
        return await Task.findAll({
            where: {
                type: type
            }
        })
    }

    /**
     * 查询在钱的范围内的任务
     * @param username username of the user who want to search
     */
    static async getTaskByMoney(money_low, money_high) {
        money_low = parseFloat(money_low)
        money_high = parseFloat(money_high)
        return await models.Task.findAll({
            where: {
                money: {
                    [Op.between]: [money_low, money_high]
                }
            }
        })
    }

    /**
     * 查询可接受的任务列表
     * @param username username of the user who want to search
     */
    static async getTaskByUserRelease(username) {
        return await models.Task.findAll({
            where: {
                publisher: username
            }
        })
    }

     /**
      * 接受任务
      * @param username the user's username
      * @param task_id the task's id
      */
     static async acceptTask(username, task_id) {
         await models.TR.create({
             username: username,
             task_id: task_id,
             state: 'in_progress'
         })
     }

     /**
      * 放弃一个任务
      * @param username
      * @param task_id
      */
     static async giveUpTask(username, task_id) {
        await models.TR.destory({
            where: {
                username: username,
                task_id: task_id
            }
        })
    }

    /**
     * 更新任务信息
     * 
     * @param: task_id 任务Id
     * @param: new_data 新的任务信息，要求传入
     *          1. state: 'in_progress'/'complete'...
     *          2. updateAt: 现在的时间
     */
    static async updateTask(task_id, new_data) {
        await models.Task.update({
            state: new_data.state,
            updatedAt: new_data.updatedAt
        }, {
            where: {
                task_id: task_id
            }
        })
    }

    static async getTaskByInUserPage(restriction) {
        // range = group id, type = task.type, username
        models.Task.hasMany(models.TeamTask, {foreignKey: "task_id"})
        models.TeamTask.belongsTo(models.Task, {foreignKey: "task_id"})
        // models.
        // // Task 
        // return await models.Task.findAll({
            
        // })
    }

    static async getTaskByRestrict(restriction) {
        return await models.Task.findAll({
            where: restriction
        })
    }

    static async deleteTaskByTaskID(task_id) {
        return await models.Task.destroy({
            where: {
                task_id: task_id
            }
        })
    }

    static async searchTaskByAccepter(username) {
        
        return await models.TR.findAll({
            where: {
                username: username
            },
            include: [{
                model: models.Task,
                include: [{
                    model: models.User,
                    attributes: ['username', 'avatar']
                }]
            }]
        })
    }
}

/**
 * 检查 `query_params[which]` 参数项
 * * 若为 `1,2,3,4` 这种格式, 将其转化为 {[Op.or]: [1,2,3,4]}
 * * 若为 `all`, 删除该项
 * 
 * @param query_params  JSON格式的查询字符串
 * @param which         检查的参数名称
 */
function checkParamsAndConvert(query_params, whichs) {
    let _check_single = (query_params, which) => {
        console.log('Change ', which)
        if (query_params[which].toLowerCase() == 'all') {
            // 无需任何限制
            query_params[which] = {
                [Op.or]: []
            }
        } else {
            // 说明是输入数组形式，改成 Op.or
            query_params[which] = {
                [Op.or]: query_params[which].split(',')
            }
        }
        return query_params
    }

    if (whichs instanceof Array) {
        for (i = 0; i < whichs.length; i++) {
            query_params = _check_single(query_params, whichs[i])
        }
    } else {
        query_params = _check_single(query_params, whichs)
    }
    
    return query_params
}

module.exports = TaskModel;