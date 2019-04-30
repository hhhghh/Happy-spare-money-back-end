const UserModel = require('../modules/userModel')

class UserController {
    /**
     * 用户注册
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async register(ctx) {
        // 接手客户端请求
        let req = ctx.request.body;
    
        try {
            const user = await UserModel.getUserInfo(req.info.username);
            if (user != null) {
                ctx.status = 409;
                ctx.body = {
                    code: 409,
                    msg: '该用户已存在',
                    data: null 
                }   
                return
            }
            const res = await UserModel.createUser(req.type, req.info);
            ctx.status = 200;
            ctx.body = {
                code: 200,
                msg: 'success',
                data: res
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: 'failed',
                data: err
             }
        }
            /*ctx.status = 400;
            ctx.body = {
                code: 400,
                msg: 'bad request',
                data: req
            } */ 
    }

    /**
     * 用户登录
     * @param {*} username 
     * @param {*} password 
     */
    static async login(ctx) {
        let req = ctx.request.body;
        try {
            const flag = await UserModel.getUserByUsernameAndPassword(req.type, req.username, req.password); 
            if (flag === 1) {
                ctx.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '用户名或密码错误',
                    data: 'error' 
                }   
            } 
            else if (flag === 2) {
                ctx.status = 413;
                ctx.body = {
                    code: 413,
                    msg: '账户类型错误',
                    data: 'error' 
                }    
            }
            else if(flag === 0) {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    msg: 'success',
                    data: null 
                }
            }
        } catch(err) {
            ctx.status = 500;
                ctx.body = {
                    code: 500,
                    msg: 'failed',
                    data: err
                }
        }
    }

    /**
     * 根据 username 查询 user 信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getUserInfo(username) {
        let result;
        try {
            const data = await UserModel.getUserInfo(username);
            if (data == null) {
                result = {
                code: 412,
                msg: '用户不存在',
                data: err
                }       
            } else{
                if (data.account_state != 0) {
                    result = {
                        code: 402,
                        msg: '查询类型错误',
                        data: null
                    }
                }
                else {
                    result = {
                        code: 200,
                        msg: 'success',
                        data: data
                   } 
                }
            }
        } catch(error) {
            result = {
                code: 412,
                msg: '用户不存在',
                data: error
            }
        }
        return result;
    }

    /**
     * 根据 organizationname 查询 organization 信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getOrgInfo(organizationname) {
        let result;
        try {
            const data = await UserModel.getUserInfo(organizationname);
            if (data == null) {
                result = {
                code: 400,
                msg: 'bad request',
                data: err
                }       
            } else{
                if (data.account_state != 1) {
                    result = {
                        code: 402,
                        msg: '查询类型错误',
                        data: null
                    }
                }
                else {
                    result = {
                        code: 200,
                        msg: 'success',
                        data: data
                   } 
                }
            }
        } catch(error) {
            result = {
                code: 412,
                msg: 'failed',
                data: error
            }
        }
        return result;
    }


    static async updateUserInfo(ctx) {
        let req = ctx.request.body;
        try {
            const data = await UserModel.updateUserInfo(req);
            if (data === 0) {
                ctx.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '更新失败',
                    data: 'error' 
                }        
            } else{
                const user = await UserModel.getUserInfo(req.username);
                if (user !== null) {
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        msg: '更新成功',
                        data: user
                    }
                } 
                else {
                    ctx.status = 412;
                    ctx.body = {
                        code: 412,
                        msg: '更新失败',
                        data: 'error' 
                    }   
                }
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: 'failed',
                data: error
            } 
        }
    }

    static async updateUserMoney(ctx) {
        let req = ctx.request.body;
        try {
            const data = await UserModel.getUserInfo(req.username);
            if (data === null) {
                ctx.status = 413;
                ctx.body = {
                    code: 413,
                    msg: '无当前用户',
                    data: 'error' 
                }    
            } else {
                const state = await UserModel.updateUserMoney(req.username, req.money);
                if (state === -1) {
                    ctx.status = 412;
                    ctx.body = {
                        code: 412,
                        msg: '账户余额不足',
                        data: 'error' 
                    }
                } else if (state === 0) {   
                    const user = await UserModel.getUserInfo(req.username);
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        msg: '充值成功',
                        data: user.money
                    }  
                }
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: 'failed',
                data: req
            }
        }
    }

    static async updateUserScore(ctx) {
        let req = ctx.request.body;
        try {
            const data = await UserModel.getUserInfo(req.username);
            if (data === null) {
                ctx.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '无当前用户',
                    data: 'error' 
                }    
            } else {
                const state = await UserModel.updateUserScore(req.username, req.score);
                if (state === -1) {
                    ctx.status = 412;
                    ctx.body = {
                        code: 412,
                        msg: '账户信用分数不足',
                        data: 'error' 
                    }
                } else if (state === 0) {   
                    const user = await UserModel.getUserInfo(req.username);
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        msg: '增加信用度成功',
                        data: user.score
                    }  
                }
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: 'failed',
                data: req
            }
        }
    }

    static async getUserAvatar(username) {
        let result;
        try {
            const data = await UserModel.getUserAvatar(username);
            if (data == 1) {
                result = {
                code: 400,
                msg: '该用户不存在',
                data: err
                }       
            } 
            else if (data == 0) {
                const user = await UserModel.getUserInfo(username);
                result = {
                    code: 200,
                    msg: 'success',
                    data: user.avatar
                }
            }
        } catch(error) {
            result = {
                code: 500,
                msg: 'failed',
                data: error
            }
        }
        return result;    
    }
}

module.exports = UserController;
