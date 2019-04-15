const TeamModel = require('../modules/teamModel');

class TeamController {
    /**
     * 创建team
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        // 接收客服端
        let req = ctx.request.body;
        if (req.team_name
            && req.description
        ) {
            try {
                const ret = await TeamModel.createTeam(req);
                // 把刚刚新建的文章ID查询文章详情，且返回新创建的文章信息
                const data = await TeamModel.getTeamDetail(ret.team_id);

                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    msg: '创建team成功',
                    data: data
                }

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = {
                    code: 200,
                    msg: '创建team失败',
                    data: err
                }
            }
        } else {
            ctx.response.status = 416;
            ctx.body = {
                code: 200,
                msg: '参数不齐全',
            }
        }

    }

    /**
     * 获取文章详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        let team_id = ctx.params.team_id;
        if (team_id) {
            try {
                // 查询team详情模型
                let data = await TeamModel.getTeamDetail(team_id);
                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data: data
                }

            } catch (err) {
                ctx.response.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '查询失败',
                    data: err
                }
            }
        } else {
            ctx.response.status = 416;
            ctx.body = {
                code: 416,
                msg: 'team ID必须传'
            }
        }
    }

}
module.exports = TeamController;