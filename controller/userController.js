const UserModel = require('../modules/userModel')

class UserController {
    /**
     * 创建 user
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        // 接手客户端请求
        let req = ctx.request.body;
        if (req.username) {
            try {
                const ret = await UserModel.createUser(req);
                const data = await UserModel.getUserDetail(ret.username);
                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    msg: '创建 user 成功',
                    data: data
                }
            } catch (err) {
                ctx.response.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '创建 user 失败',
                    data: err
                }    
            }
        } else {
            ctx.response.status = 416;
            ctx.body = {
                code: 416,
                msg: '参数不齐全',
            }
        }
    }

    /**
     * 获取 user 详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        let username = ctx.params.username;
        if (username) {
            try {
                // 查询use详情模型
                let data = await UserModel.getUserDetail(username);
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
                msg: 'username必须传'
            }
        }
    }

}

module.exports = UserController;
