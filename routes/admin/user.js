const 
    Router = require('koa-router');

var router = new Router();

router.get('/',async (ctx)=>{
    // ctx.body = '后台登陆页面'
    await ctx.render('admin/user/list')
})


router.get('/add',async (ctx)=>{
    // ctx.body = '后台登陆页面'
    await ctx.render('admin/user/add')
})

//暴露：
module.exports = router.routes();