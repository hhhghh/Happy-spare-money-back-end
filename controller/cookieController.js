const session = require("koa-session2");
const Store = require("../utils/Store.js");
global.redis = new Store();

class CookieController {
    /**
     * 判断前端请求是否携带了正确的cookies
     * @param ctx
     * @returns
     *  -1: 请求未携带cookies或cookie失效
     *  -0：cookies认证成功
     */
    static async judgeCookies(ctx) {
        return ctx.session.username ? 0 : -1;
    }

    /**
     * 从前端的一个请求中通过cookies获得用户名
     * @param ctx
     * @returns
     *  -1：cookies无效
     *  username: 用户名，一个字符串
     */
    static async getUsernameFromCtx(ctx) {
        return ctx.session.username ? ctx.session.username : -2;
    }
}

module.exports = CookieController;