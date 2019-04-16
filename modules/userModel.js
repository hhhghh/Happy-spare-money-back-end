const db = require('../config/db');
const Sequelize = db.sequelize;
const User = Sequelize.import('../table/user');

User.sync({force: false});

class UserModel {
    /**
     * 创建 user 模型
     * @param data
     * @returns {Promise<*>} 
     */
    static async createUser(data) {
        return await User.create({
            username: data.username,
            password: data.password,
            score: data.score,
            money: data.money,
            true_name: data.true_name,
            school_name: data.school_name,
            grade: data.grade,
            avatar: data.avatar,
            nickname: data.nickname,
            wechat: data.wechat,
            QQ: data.QQ,
            phone_number: data.phone_number,
            account_state: data.account_state,
        })
    }

    /**
     * 查询 user 详情数据
     * @param username
     * @returns {Promise<Model>}
     */
    static async getUserDetail(username) {
        return await User.findOne({
            where: {
                username
            }
        })
    }
}

module.exports = UserModel;