const session = require("koa-session2");
const Store = require("../utils/Store.js");
global.redis = new Store();

class CookieController {
    /**
     * 判断前端请求是否携带了cookies
     * 若携带了还会判断session是否过期
     * @param ctx
     * @returns
     *  -1: 请求未携带cookies
     *  -2：携带了cookies但是cookies已过期
     *   0：cookies认证成功
     */
    static async judgeCookies(ctx) {
        const SESSIONID = ctx.cookies.get('SESSIONID');
        //没有携带cookies
        if (!SESSIONID) {
            return -1
        }
        // 如果有SESSIONID，就去redis里拿数据
        const redisData = await redis.get(SESSIONID);

        //携带了cookies但session已过期
        if (!redisData) {
            return -2
        }

        return 0
    }

    /**
     * 从前端的一个请求中通过cookies获得用户名
     * @param ctx
     * @returns
     *  -1：未携带cookies
     *  -2：携带的cookies无效或已过期
     *  username: 用户名，一个字符串
     */
    static async getUsernameFromCtx(ctx) {
        const username = ctx.session.username;
        if (username == null) {
            return -2
        }
        return username;
    }
}

module.exports = CookieController;