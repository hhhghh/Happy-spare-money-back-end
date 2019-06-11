const db = require('../config/db');
const sequelize = db.sequelize;
const User = sequelize.import('../table/user');
const Piu = sequelize.import('../table/piu')
const Team = sequelize.import('../table/team')
const Pit = sequelize.import('../table/pit')
const Tr = sequelize.import('../table/tr')
const Task = sequelize.import('../table/task')
const All_Tables = require('../table/all_tables')

User.sync({force: false});
Piu.sync({force: false})
Team.sync({force: false})
Pit.sync({force: false})
Tr.sync({force: false})
Task.sync({force: false})

class UserModel {
    /**
     * 创建 user 模型
     * @param data
     * @returns {Promise<*>} 
     */
    static async createUser(info, avatarExtName) {
        var avatar = '';
        if (avatarExtName == null) {
            avatar = 'http://139.196.79.193:3000/awesomeface.png'
        }
        else {
            avatar = 'http://139.196.79.193:3000/uploads/user/' + info.username + avatarExtName
        }
        return await User.create({
            username: info.username,
            password: info.password,
            true_name: info.name,
            school_name: info.school,
            grade: info.grade,
            avatar: avatar,
            wechat: info.weChat,
            QQ: info.qq,
            phone_number: info.phone,
            account_state: info.type
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
        return data
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
    static async updateUserInfo(data, ifChangePasswd) {
        let info = {
            grade: data.grade,
            wechat: data.wechat,
            QQ: data.qq,
            phone_number: data.phone
        };
        if (ifChangePasswd) info.password = data.newPasswd;

        return await User.update(info, {
            where: {
                username: data.username
            }
        });
    }

    static async updateAvatar(username, avatarExtName, timestamp) {     
        var avatar = 'http://139.196.79.193:3000/uploads/user/' + username + timestamp + avatarExtName
        await User.update({
            avatar: avatar
        }, {
            where: {
                username: username
            }
        });
        return avatar
    }

    /**
     * 更新用户账户余额
     * @param {*} username 
     * @param {*} money 
     */
    static async deposit(username, money) {
        const data = await User.findOne({
            where: {
                username: username
            }
        }) 

        var num = Number(money) + data.money

        if (num < 0) {
            return -1;
        }
        else {
            await User.update({
                money: num
            }, {
                where: {
                    username: username
                }
            });
            return 0;
        }  
    }

    /**
     * 更新用户账户余额
     * @param {*} username 
     * @param {*} money 
     */
    static async withdraw(username, money) {
        const data = await User.findOne({
            where: {
                username: username
            }
        }) 

        var num = data.money - Number(money)

        if (num < 0) {
            return -1;
        }
        else {
            await User.update({
                money: num
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

    static async UserBlacklistUser(username1, username2) {

        const user1 = await User.findOne({
            where: {
                username: username1
            }
        })
        if (user1 === null) {
            return 1
        }
        const user2 = await User.findOne({
            where: {
                username: username2
            }
        })
        if (user2 === null) {
            return 2
        }
        if (user2.account_state == 1) {
            return 3
        }
        const relate = await Piu.findOne({
            where: {
                ins_name: username1,
                username: username2
            }
        })
        if (relate === null) {
            return 4
        }
        await Piu.destroy({
            where: {
                ins_name: username1,
                username: username2
            }
        })
        return 0
    }

    static async TeamBlacklistOrg(ins_name, team_id) {
        const ins = await User.findOne({
            where: {
                username: ins_name
            }
        })
        if (ins === null) {
            return 1
        }
        if (ins.account_state != 1) {
            return 2
        }
        const team = await Team.findOne({
            where: {
                team_id: team_id
            }
        })
        if (team === null) {
            return 3
        }
        const relate = await Pit.findOne({
            where: {
                ins_name: ins_name,
                team_id: team_id
            }
        })
        if (relate === null) {
            return 4
        }
        await Pit.destroy({
            where: {
                ins_name: ins_name,
                team_id: team_id    
            }
        })
        return 0    
    }

    static async UserCancelBlack(username1, username2) {
        const user1 = await User.findOne({
            where: {
                username: username1
            }
        })
        if (user1 === null) {
            return 1
        }
        const user2 = await User.findOne({
            where: {
                username: username2
            }
        })
        if (user2 === null) {
            return 2
        }
        if (user2.account_state == 1) {
            return 3
        }
        const relate = await Piu.findOne({
            where: {
                ins_name: username1,
                username: username2
            }
        })
        if (relate !== null) {
            return 4
        }
        await Piu.create({
            ins_name: username1,
            username: username2
        })
        return 0        
    }

    static async teamCancelBlack(ins_name, team_id) {
        const ins = await User.findOne({
            where: {
                username: ins_name
            }
        })
        if (ins === null) {
            return 1
        }
        if (ins.account_state != 1) {
            return 2
        }
        const team = await Team.findOne({
            where: {
                team_id: team_id
            }
        })
        if (team === null) {
            return 3
        }
        const relate = await Pit.findOne({
            where: {
                ins_name: ins_name,
                team_id: team_id
            }
        })
        if (relate !== null) {
            return 4
        }
        await Pit.create({
            ins_name: ins_name,
            team_id: team_id
        })
        return 0        
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

    static async getAcceptedFinishedTasks(username) {
        const tasks = await Tr.findAll({
            where: {
                username: username,
                state: All_Tables.status_code.tr.CONFIRMED_OVER
            }
        })
        let data = []
        for (var i = 0; i < tasks.length; i++) {
            const ts = await Task.findOne({
                where: {
                    task_id: tasks[i].task_id
                }
            })
            data.push({
                "taskId": ts.task_id,
                "title": ts.title,
                "introduction": ts.intro == null ? null : ts.intro,
                "starttime": ts.starttime,
                "endtime": ts.endtime,
                "score": ts.score,
                "money": ts.money
            })
        }
        return data
    }

    static async getPublishedWaitedTasks(username) {
        const tasks = await Task.findAll({
            where: {
                publisher: username,
                state: All_Tables.status_code.task.WAITING_ACCPET
            }
        })
        let data = []
        for (var i = 0; i < tasks.length; i++) {
            var ts = tasks[i]
            data.push({
                "taskId": ts.task_id,
                "title": ts.title,
                "introduction": ts.intro == null ? null : ts.intro,
                "starttime": ts.starttime,
                "endtime": ts.endtime,
                "score": ts.score,
                "money": ts.money
            })    
        }
        return data
    }

    static async getPublishedFinishedTasks(username) {
        const tasks = await Task.findAll({
            where: {
                publisher: username,
                state: All_Tables.status_code.task.CONFIRM_OVER
            }
        })
        let data = []
        for (var i = 0; i < tasks.length; i++) {
            var ts = tasks[i]
            data.push({
                "taskId": ts.task_id,
                "title": ts.title,
                "introduction": ts.intro == null ? null : ts.intro,
                "starttime": ts.starttime,
                "endtime": ts.endtime,
                "score": ts.score,
                "money": ts.money
            })    
        }
        return data    
    }

    static async getCanPublishTasksOrg(teamId) {
        const team = await Team.findOne({
            where: {
                team_id: teamId
            }
        })
        if (team == null) {
            return -1
        }
        let data = []
        const orgs = await Pit.findAll({
            where: {
                team_id: teamId
            }
        }) 
        for (var i = 0; i < orgs.length; i++) {
            const org = await User.findOne({
                where: {
                    username: orgs[i].ins_name
                }
            })
            data.push({
                "orgorganizationname": org.username,
                "orgorganizationavatar": org.avatar
            })
        }
        return data
    }

    static async getTaskByTaskId(taskId) {
        return await Task.findOne({
            where: {
                task_id: taskId
            }
        })
    }
}

module.exports = UserModel;