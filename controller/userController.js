const UserModel = require('../modules/userModel')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const session = require("koa-session2")
const Store = require("../utils/Store.js")
// const redis = new Store();
const CookieController = require('./CookieController');
require('./CookieController');


class UserController {

    /**
     * 判断前端请求是否携带了cookies
     * 若携带了还会判断session是否过期
     * @param ctx
     * @returns
     *  -1: 请求未携带cookies
     *  -2：携带了cookies但是cookies已过期
     *   0：cookies认证成功
     */
    // static async judgeCookies(ctx) {
    //     const SESSIONID = ctx.cookies.get('SESSIONID');
    //     //没有携带cookies
    //     if (!SESSIONID) {
    //         return -1
    //     }
    //     // 如果有SESSIONID，就去redis里拿数据
    //     const redisData = await redis.get(SESSIONID);
    //
    //     //携带了cookies但session已过期
    //     if (!redisData) {
    //         return -2
    //     }
    //
    //     return 0
    // }

    /**
     * 从前端的一个请求中通过cookies获得用户名
     * @param ctx 
     * @returns
     *  -1：未携带cookies
     *  -2：携带的cookies无效或已过期
     *  username: 用户名，一个字符串 
     */
    // static async getUsernameFromCtx(ctx) {
    //     const flag = await UserController.judgeCookies(ctx);
    //     if (flag === -1) {
    //         return -1
    //     }
    //     else if (flag === -2) {
    //
    //         return -2
    //     }
    //     const SESSIONID = ctx.cookies.get('SESSIONID')
    //     const redisData = await redis.get(SESSIONID)
    //
    //     return redisData.username
    // }
    
    /**
     * 用户注册
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async register(ctx) {
        function formidablePromise (req, opts) {
            return new Promise(function (resolve, reject) {
              var form = new formidable.IncomingForm(opts)
              form.keepExtensions = true;     
              form.uploadDir = 'static/uploads/user/';
              form.parse(req, function (err, fields, files) {
                var extname = path.extname(files.avatar.path)
                var oldpath = files.avatar.path
                var newpath = form.uploadDir + fields.username + extname
                if (!fs.existsSync(newpath)) {
                    fs.rename(oldpath, newpath, function(err) {
                        if (err) {
                            throw err
                        }
                    })
                }
                if (err) return reject(err)
                resolve({ fields: fields, files: files, newpath: newpath, oldpath: oldpath, extname: extname })
              })
            })
          }

        var body = await formidablePromise(ctx.req, null);


        var info = body.fields
        try {
            const user = await UserModel.getUserInfo(info.username);
            if (user != null) {
                ctx.status = 409;
                ctx.body = {
                    code: 409,
                    msg: '该用户已存在',
                    data: null 
                }
                if (fs.existsSync(body.oldpath)) {
                    fs.unlinkSync(body.oldpath)
                }
                return
            }
            const res = await UserModel.createUser(info.type, info, body.extname);
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
                
                const SESSIONID = ctx.cookies.get('SESSIONID')
                if (SESSIONID) {
                    if (await CookieController.getUsernameFromCtx(ctx) == req.username) {
                        console.log(await CookieController.getUsernameFromCtx(ctx))
                        await redis.destroy(SESSIONID)
                    }
                }
                ctx.session.username = req.username
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    msg: '登录成功',
                    data: ctx.session
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

    static async logout(ctx) {
        const flag = await CookieController.judgeCookies(ctx);
        if (flag == -1) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: '未携带cookies',
            }
        } 
        else if (flag == -2) {
            ctx.status = 402;
            ctx.body = {
                code: 402,
                msg: 'cookies已过期，已自动登出',
            }
        }        
        else if(flag == 0) {
            const SESSIONID = ctx.cookies.get('SESSIONID');
            const redisData = await redis.get(SESSIONID);
            const user = redisData.username

            await redis.destroy(SESSIONID);
            ctx.status = 200;
            ctx.body = {
                code: 200,
                msg: user + '登出成功'
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
                        data: {
                            "username": data.username,
                            "name": data.true_name,
                            "school": data.school_name,
                            "grade": data.grade,
                            "avatar": data.avatar,
                            "phone": data.phone_number,
                            "wechat": data.wechat,
                            "qq": data.QQ
                        } 
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
                        data: {
                            "orgname": data.username,
                            "score": 100,
                            "school": "SYSU",
                            "wechat": null,
                            "qq": null,
                            "phone_number": null
                        }
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
        const SESSIONID = ctx.cookies.get('SESSIONID');

        if (!SESSIONID) {
            ctx.status = 412;
                ctx.body = {
                    code: 412,
                    msg: '没有携带SESSIONID，去登录吧~',
                    data: 'error' 
                } 
                return false;
        }
        // 如果有SESSIONID，就去redis里拿数据
        const redisData = await redis.get(SESSIONID);

        if (!redisData) {
            ctx.status = 412;
            ctx.body = {
                code: 412,
                msg: 'SESSIONID已经过期，去登录吧~',
                data: 'error'
            } 
            return false
        }

        const username = JSON.parse(redisData.username);
        console.log(username)
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

    static async UserBlacklistUser(ctx) {
        let req = ctx.request.body
        let username1 = req.username1
        let username2 = req.username2
        if (username1 && username2) {
            try {
            const result = await UserModel.UserBlacklistUser(username1, username2)
            if (result == 0) {
                ctx.status = 200
                ctx.body = {
                    code: 200,
                    msg: '拉黑成功',
                    data: result
                }
            }
            else if (result == 1) {
                ctx.status = 402
                ctx.body = {
                    code: 402,
                    msg: '被拉黑机构或用户不存在',
                    data: result
                }   
            }
            else if (result == 2) {
                ctx.status = 403
                ctx.body = {
                    code: 403,
                    msg: '用户不存在',
                    data: result
                }   
            }
            else if (result == 3) {
                ctx.status = 405
                ctx.body = {
                    code: 405,
                    msg: '机构不能拉黑用户',
                    data: result
                }   
            }
            else if (result == 4) {
                ctx.status = 406
                ctx.body = {
                    code: 406,
                    msg: '已拉黑',
                    data: result
                }   
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器异常',
                data: err
            }    
        }
        }
    }

    static async teamBlacklistOrg(ctx) {
        let req = ctx.request.body
        let ins_name = req.ins_name
        let team_id = req.team_id
        if (ins_name && team_id) {
            try {
            const result = await UserModel.TeamBlacklistOrg(ins_name, team_id)
            if (result == 0) {
                ctx.status = 200
                ctx.body = {
                    code: 200,
                    msg: '拉黑成功',
                    data: result
                }
            }
            else if (result == 1) {
                ctx.status = 402
                ctx.body = {
                    code: 402,
                    msg: '被拉黑机构不存在',
                    data: result
                }   
            }
            else if (result == 2) {
                ctx.status = 403
                ctx.body = {
                    code: 403,
                    msg: '该用户不是机构',
                    data: result
                }   
            }
            else if (result == 3) {
                ctx.status = 405
                ctx.body = {
                    code: 405,
                    msg: '小组不存在',
                    data: result
                }   
            }
            else if (result == 4) {
                ctx.status = 406
                ctx.body = {
                    code: 406,
                    msg: '已拉黑，不能重复拉黑',
                    data: result
                }   
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器异常',
                data: err
            }
        }
        }    
    }

    static async UserCancelBlack(ctx) {
        let req = ctx.request.body
        let username1 = req.username1
        let username2 = req.username2
        if (username1 && username2) {
            try {
            const result = await UserModel.UserCancelBlack(username1, username2)
            if (result == 0) {
                ctx.status = 200
                ctx.body = {
                    code: 200,
                    msg: '取消拉黑成功',
                    data: result
                }
            }
            else if (result == 1) {
                ctx.status = 402
                ctx.body = {
                    code: 402,
                    msg: '取消拉黑的机构或用户不存在',
                    data: result
                }   
            }
            else if (result == 2) {
                ctx.status = 403
                ctx.body = {
                    code: 403,
                    msg: '用户不存在',
                    data: result
                }   
            }
            else if (result == 4) {
                ctx.status = 405
                ctx.body = {
                    code: 405,
                    msg: '没有拉黑过的用户或机构不能取消拉黑',
                    data: result
                }   
            }
            else if (result == 3) {
                ctx.status = 406
                ctx.body = {
                    code: 406,
                    msg: '机构不能取消拉黑',
                    data: result
                }   
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器异常',
                data: err
            }    
        }
        }
    }

    static async teamCancelBlack(ctx) {
        let req = ctx.request.body
        let ins_name = req.ins_name
        let team_id = req.team_id
        if (ins_name && team_id) {
            try {
            const result = await UserModel.teamCancelBlack(ins_name, team_id)
            if (result == 0) {
                ctx.status = 200
                ctx.body = {
                    code: 200,
                    msg: '取消屏蔽成功',
                    data: result
                }
            }
            else if (result == 1) {
                ctx.status = 402
                ctx.body = {
                    code: 402,
                    msg: '取消拉黑机构不存在',
                    data: result
                }   
            }
            else if (result == 2) {
                ctx.status = 403
                ctx.body = {
                    code: 403,
                    msg: '该用户不是机构',
                    data: result
                }   
            }
            else if (result == 3) {
                ctx.status = 405
                ctx.body = {
                    code: 405,
                    msg: '小组不存在',
                    data: result
                }   
            }
            else if (result == 4) {
                ctx.status = 406
                ctx.body = {
                    code: 406,
                    msg: '没有拉黑无法取消拉黑',
                    data: result
                }   
            }
        } catch(err) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器异常',
                data: err
            }
        }
        }    
    }

    static async getUserAvatar(username) {
        let result;
        try {
            const data = await UserModel.getUserAvatar(username);
            if (data == 1) {
                result = {
                code: 402,
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
    
    static async getAcceptedFinishedTasks(username) {
        let result;
        try{
            const user = await UserModel.getUserInfo(username)
            if (user === null) {
                result = {
                    code: 412,
                    msg: "用户不存在",
                    data: null
                }   
            }
            else {
                const data = await UserModel.getAcceptedFinishedTasks(username);
                result = {
                    code: 200,
                    msg: "success",
                    data: data
                }
            }
        } catch(error) {
            result = {
                code: 500,
                msg: "服务器异常",
                data: error
            }
        }
        return result;

    }

    static async getPublishedWaitedTasks(username) {
        let result;
        try{
            const user = await UserModel.getUserInfo(username)
            if (user === null) {
                result = {
                    code: 412,
                    msg: "用户不存在",
                    data: null
                }   
            }
            else {
                const data = await UserModel.getPublishedWaitedTasks(username);
                result = {
                    code: 200,
                    msg: "success",
                    data: data
                }
            }
        } catch(error) {
            result = {
                code: 500,
                msg: "服务器异常",
                data: error
            }
        }
        return result;   
    }

    static async setRate(ctx) {
        console.log()
        const flag = await UserController.judgeCookies(ctx);
        console.log(1)
        if (flag == -1 || flag == -2) {
            console.log(2)
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: 'failed',
                data: null
            }
        } 
        else if(flag == 0) {
            console.log(3)
            const SESSIONID = ctx.cookies.get('SESSIONID');
            const redisData = await redis.get(SESSIONID);
            const user = redisData.username
            
            var taskId = ctx.request.body.taskId
            var value = ctx.request.body.value

            const task = await UserModel.getTaskByTaskId(taskId) 
            if (task === null) {
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    msg: 'failed',
                    data: null
                }
            }
            else {
                if (task.publisher == user) {
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        msg: 'success',
                        data: value
                    }   
                }
                else {
                    ctx.status = 401;
                    ctx.body = {
                        code: 401,
                        msg: 'failed',
                        data: null
                    }   
                }
            }
        }
    }

    static async getTeamMembersAvatar(ctx) {
        var members = ctx.request.body.members;
        console.log(members)
        var data = [];
        for (var i = 0; i < members.length; i++) {
            var user = await UserModel.getUserInfo(members[i].username)
            if (user == null) {
                ctx.status = 200
                ctx.body = {
                    code: 401,
                    msg: members[i].username + " 不存在",
                    data: null
                }
                return
            }
            var useravatar = await UserController.getUserAvatar(members[i].username)
            data.push({
                "username" : members[i].username,
                "avatar" : useravatar.data
            })
        }

        ctx.status = 200
        ctx.body = {
            code: 200,
            msg: "success",
            data: data
        }
    }

    
}

module.exports = UserController;
