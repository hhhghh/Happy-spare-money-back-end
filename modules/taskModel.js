const db = require('../config/db');
const Sequelize = db.sequelize;
const User = Sequelize.import('../table/user');
const Task = Sequelize.import('../table/task');
const TR = Sequelize.import('../table/tr');

Task.sync({force: false});

class TaskModel {
    /**
     * 创建 task 模型
     * @param data
     * @returns {Promise<*>}
     */
    static async createTask(data) {
        return await Task.create({
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
     * 查询取 task 详情数据
     * @returns {Promise<Model>}
     * @param task_id
     */
    static async getTaskDetail(task_id) {
        return await Task.findOne({
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
        return await Task.findAll({
            where: {
                state: 'in_progress'
            }
        })
    }

     /**
      * 接受任务
      * @param username the user's username
      * @param task_id the task's id
      */
     static async acceptTask(username, task_id) {
         await TR.create({
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
        await TR.destory({
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
        await Task.update({
            state: new_data.state,
            updatedAt: new_data.updatedAt
        }, {
            where: {
                task_id: task_id
            }
        })
    }
}



module.exports = TaskModel;