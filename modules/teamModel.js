const db = require('../config/db');
const Sequelize = db.sequelize;
const Team = Sequelize.import('../table/team');

Team.sync({force: false});

class TeamModel {
    /**
     * 创建 team 模型
     * @param data
     * @returns {Promise<*>}
     */
    static async createTeam(data) {
        return await Team.create({
            team_name: data.team_name,
            logo: data.logo,
            description: data.description,
            tag:data.tag,
        })
    }

    /**
     * 查询取 team 详情数据
     * @returns {Promise<Model>}
     * @param team_id
     */
    static async getTeamDetail(team_id) {
        return await Team.findOne({
            where: {
                team_id
            }
        })
    }

    /**
     * 
     */
}
module.exports = TeamModel;