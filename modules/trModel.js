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
        return await TR.destroy({
            where: {
                username: username,
                task_id: task_id
            }
        })
    }
    
    static async searchTRByRestrict(restriction) {
        return await TR.findAll({
            where: restriction
        })
    }

    static async confirmComplement(username, task_id, score) {
        return await Promise.all([
            TR.update({
                state: 2
            }, {
                where: {
                    username: username,
                    task_id: task_id
                }
            }),
            User.update({
                score: score
            }, {
                where: {
                    username: username
                }
            })
        ])
        // 评分直接更新了，TODO... 还待考虑到底怎么操作
    }
}



module.exports = TRModel;