const db = require('../config/db');
const Sequelize = require('sequelize')
const sequelize = db.sequelize;
const models = require('../table/all_tables')
const Op = Sequelize.Op

class TRModel {
    /**
     * 添加 Task Recivers
     * @param  task_id 
     */
    static async receiveTask(username, task_id) {
        return await models.TR.create({
            username: username,
            task_id: task_id,
            state: models.status_code.tr.WAITING_TO_BE_DONE
        })
    }
    
     /**
     * 查询取 task relations 详情数据
     * @returns {Promise<Model>}
     * @param task_id
     */
    static async searchByTaskId(task_id) {
        return await models.TR.findAll({
            where: {
                task_id: task_id
            }
        })
    }

    static async searchTRByUsername(username) {
        return await models.TR.findAll({
            where: {
                username: username
            }
        })
    }

    static async deleteTR(username, task_id) {
        return await models.TR.destroy({
            where: {
                username: username,
                task_id: task_id
            }
        })
    }
    
    static async searchTRByRestrict(restriction) {
        return await models.TR.findAll({
            where: restriction
        })
    }

    static async accepter_make_complement(username, task_id) {
        return await models.TR.update({
            state: models.status_code.tr.WAITING_CONFIRM
        }, {
            where: {
                username: username,
                task_id: task_id
            }
        })
        // 评分直接更新了，TODO... 还待考虑到底怎么操作
    }

    static async comfirm_complement(username, task_id, score) {
        let result = await Promise.all([
            models.TR.update({
                state: models.status_code.tr.CONFIRMED_OVER
            }, {
                where: {
                    username: username,
                    task_id: task_id
                }
            }),
            models.User.update({
                // TODO, 更新评分，使用score来更新
                
            }, {
                where: {
                    username: username
                }
            })
        ]) 
        
        return await Promise.all([
            models.TR.findOne({
                where: {
                    username: username,
                    task_id: task_id
                }
            }),
            models.User.findByPk(username)
        ])
    }

}



module.exports = TRModel;