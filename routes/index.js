const 
    Router = require('koa-router');

var router = new Router();


router.get('/',async (ctx)=>{
    ctx.body = '后台管理首页'
})



//暴露：
module.exports = router.routes();