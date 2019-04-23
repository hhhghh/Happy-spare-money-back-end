const db = require('../config/db');
const Sequelize = require('sequelize');
const sequelize = db.sequelize;
const User = sequelize.import('../table/user');
const Team = sequelize.import('../table/team');
const Teamlabel = sequelize.import('../table/teamlabel');
const Members = sequelize.import('../table/members');
const Pit = sequelize.import('../table/pit');

// User.sync({force: false});
Team.sync({force: false});
Teamlabel.sync({force: false});
Members.sync({force: false});

class TeamModel {
    // 创建小组
    static async createTeam(data) {
        return await Team.create({
            team_name : data.team_name,
            leader : data.leader,
            logo : data.logo,
            description : data.description,
            limit : data.limit,
        })
    }

    static async createTeamMember(team_id, username) {
        return await Members.create({
            team_id : team_id,
            member_username : username
        })
    }

    static async createTeamLabel(team_id, label) {
        return await Teamlabel.create({
            team_id : team_id,
            label : label
        })
    }

    //  根据组名来查找小组
    static async getTeamByName(team_name) {
        Team.hasMany(Teamlabel, {foreignKey : 'team_id'});
        Teamlabel.belongsTo(Team, {foreignKey : 'team_id'});
        Team.hasMany(Members, {foreignKey : 'team_id'});
        Members.belongsTo(Team, {foreignKey : 'team_id'});
        return await Team.findAll({
            where: {
                team_name : team_name,
            },
            include: [{
                model: Teamlabel,
            },{
                model: Members,
            }],
        })
    }

    // 根据小组id来查找小组
    static async getTeamByTeamId(team_id) {
        Team.hasMany(Teamlabel, {foreignKey : 'team_id'});
        Teamlabel.belongsTo(Team, {foreignKey : 'team_id'});
        Team.hasMany(Members, {foreignKey : 'team_id'});
        Members.belongsTo(Team, {foreignKey : 'team_id'});
        return await Team.findOne({
            where: {
                team_id : team_id,
            },
            include: [{
                model: Teamlabel,
            },{
                model: Members,
            }],
        })
    }

    // 根据标签来查找小组
    static async getTeamByLabel(label) {
        Team.hasMany(Teamlabel, {foreignKey : 'team_id'});
        Teamlabel.belongsTo(Team, {foreignKey : 'team_id'});
        Team.hasMany(Members, {foreignKey : 'team_id'});
        Members.belongsTo(Team, {foreignKey : 'team_id'});
        return await Team.findAll({
            include: [{
                model: Teamlabel,
                where: {
                    label : label,
                }
            },{
                model: Members,
            }],
        })
    }

    // 获取小组权限,使用根据小组id来查找小组

    //  根据用户名返回用户加入了的小组
    static async getTeamByUsername(member_username) {
        Team.hasMany(Members, {foreignKey : 'team_id'});
        Members.belongsTo(Team, {foreignKey : 'team_id'});
        Team.hasMany(Teamlabel, {foreignKey : 'team_id'});
        Teamlabel.belongsTo(Team, {foreignKey : 'team_id'});
        return await Team.findAll({
            include: [{
                model: Members,
                where: {
                    member_username : member_username
                }
            },{
                model: Teamlabel,
            }],
        });

    }

    // 根据小组id来得到小组成员
    static async getUserByTeamId(team_id) {
        return await Members.findAll({
            where: {
                team_id : team_id
            }
        })
    }

    // 返回用户是否是该小组组长，使用根据小组id来查找小组

    // 返回用户是否是该小组成员
    static async getUserByTeamIdUsername(team_id, member_username) {
        return await Members.findAll({
            where: {
                team_id : team_id,
                member_username : member_username
            }
        })
    }

    // 解散小组
    static async deleteTeamMember(team_id) {
        return await Members.destroy({
            where: {
                team_id : team_id
            }
        })
    }

    static async deleteTeamLabel(team_id) {
        return await Teamlabel.destroy({
            where: {
                team_id : team_id
            }
        })
    }

    static async deleteTeamPit(team_id) {
        return await Pit.destroy({
            where: {
                team_id : team_id
            }
        })
    }

    static async deleteTeam(team_id) {
        return await Team.destroy({
            where: {
                team_id : team_id
            }
        })
    }

    // 删除成员
    static async deleteMember(team_id, member_username) {
        return await Members.destroy({
            where: {
                team_id : team_id,
                member_username : member_username
            }
        })
    }

    // 修改组长
    static async updateTeamLeader(team_id, leader, username) {
        await Team.update({
            leader : username
        }, {
            where: {
                team_id : team_id,
                leader : leader
            }
        })
    }

    // 判断是否有user
    static async getUserByUsername(username) {
        return await User.findOne({
            where: {
                username : username
            }
        })
    }

    // 添加成员
    static async createMembers(team_id, member_username) {
        return await Members.create({
            team_id : team_id,
            member_username : member_username
        })
    }

    // 修改小组全部信息
    static async updateTeamDescription(new_data) {
        await Team.update({
            logo: new_data.logo,
            description: new_data.description,
            limit: new_data.limit
        }, {
            where: {
                team_id : new_data.team_id
            }
        })
    }
}
module.exports = TeamModel;