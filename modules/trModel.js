const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const User = sequelize.import('../table/user');
const Task = sequelize.import('../table/task');
const TR = sequelize.import('../table/tr');
const Op = Sequelize.Op

TR.sync({force: false});

class TRModel {
    /**
     * 添加 Task Recivers
     * @param  task_id 
     */
    static async receiveTask(username, task_id) {
        console.log("Inside receive Task", username, task_id)
        return await TR.create({
            username: username,
            task_id: task_id,
            state: 1
        })
    }
    
     /**
     * 查询取 task relations 详情数据
     * @returns {Promise<Model>}
     * @param task_id
     */
    static async searchByTaskId(task_id) {
        return await TR.findAll({
            where: {
                task_id: task_id
            }
        })
    }

    static async searchTRByUsername(username) {
        return await TR.findAll({
            where: {
                username: username
            }
        })
    }

    static async deleteTR(username, task_id) {
        return await TR.destory({
            where: {
                username: username,
                task_id: task_id
            }
        })
    }
}



module.exports = TRModel;