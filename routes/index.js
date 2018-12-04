const
    Router = require('koa-router');

var router = new Router();
var DB = require('../module/db');
var url = require('url');

//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);
    var pathname=url.parse(ctx.request.url).pathname;

    //导航条的数据
    var navResult=await DB.find('nav',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })
    //模板引擎配置全局的变量
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;

    await  next()
})


router.get('/', async (ctx) => {

    var navResult = await DB.find('nav',{$or:[{'status':1},{'status':'1'}]},{},{
        sortJson:{'sort':1}
    })

    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候状态 转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })

    ctx.render('default/index',{
        focus:focusResult,
        nav:navResult
    });
})

router.get('/news', async (ctx) => {

    ctx.render('default/news');

})

router.get('/service', async (ctx) => {

    ctx.render('default/service');

})

router.get('/about', async (ctx) => {

    ctx.render('default/about');

})

router.get('/case', async (ctx) => {

    ctx.render('default/case');

})

router.get('/connect', async (ctx) => {

    ctx.render('default/connect');
})

//暴露：
module.exports = router.routes();