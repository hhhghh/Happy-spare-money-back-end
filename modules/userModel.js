const db = require('../config/db');
const sequelize = db.sequelize;
const User = sequelize.import('../table/user');

User.sync({force: false});

class UserModel {
    /**
     * 创建 user 模型
     * @param data
     * @returns {Promise<*>} 
     */
    static async createUser(type, info) {
        return await User.create({
            username: info.username,
            password: info.password,
            score: info.score,
            money: info.money,
            true_name: info.true_name,
            school_name: info.school_name,
            grade: info.grade,
            avatar: info.avatar,
            nickname: info.nickname,
            wechat: info.wechat,
            QQ: info.QQ,
            phone_number: info.phone_number,
            account_state: type
        })
    }

    /**
     * 获取用户信息
     * @param username
     * @returns {Promise<Model>}
     */
    static async getUserInfo(username) {
        const data = await User.findOne({
            where: {
                username: username
            }
        })
        if (data != null) {
            return {
                username: data.username,
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
                account_state: data.account_state
            }
        }
        return null
    }


    /**
     * 登录时检查
     * @param username
     * @param password
     * @returns {Promise<Model>}
     */
    static async getUserByUsernameAndPassword(type, username, password) {
        const user = await User.findOne({
            where: {
                username: username,
                password: password
            }
        })
        if (user == null) {
            return 1
        }
        if (user != null) {
            if (user.account_state != type) {
                return 2
            }
            return 0
        }
    }

    /**
     * 更新用户信息
     * @param info
     * @returns {Promise<Model>}
     */
    static async updateUserInfo(info) {
        return await User.update({
            username: info.username,
            password: info.password,
            true_name: info.true_name,
            school_name: info.school_name,
            grade: info.grade,
            avatar: info.avatar,
            nickname: info.nickname,
            wechat: info.wechat,
            QQ: info.QQ,
            phone_number: info.phone_number
        }, {
            where: {
                username: info.username
            }
        });
    }

    /**
     * 更新用户账户余额
     * @param {*} username 
     * @param {*} money 
     */
    static async updateUserMoney(username, money) {
        const data = await User.findOne({
            where: {
                username: username
            }
        }) 
        money += data.money;
        if (money < 0) {
            return -1;
        }
        else {
            await User.update({
                money: money
            }, {
                where: {
                    username: username
                }
            });
            return 0;
        }  
    }

    /**
     * 更新用户的信用分数
     * @param {*} username 
     * @param {*} grade 
     */
    static async updateUserScore(username, score) {
        const data = await User.findOne({
            where: {
                username: username
            }
        }) 
        score += data.score;
        if (score < 0) {
            return -1;
        }
        else {
            await User.update({
                score: score
            }, {
                where: {
                    username: username
                }
            });
            return 0;
        } 
    }

    static async getUserAvatar(username) {
        const data = await User.findOne({
            where: {
                username: username
            }
        }) 
        if (data === null) {
            return 1;
        }
        return 0;   
    }
}

module.exports = UserModel;