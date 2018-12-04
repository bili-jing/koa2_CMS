const
Router = require('koa-router'),
ueditor = require('koa2-ueditor');


var router = new Router();
var url = require('url');



router.use(async (ctx, next) => {
    // console.log(ctx.request);
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    
    // console.log(ctx.session.userinfo);
    //权限判断：  如果有登陆信息
    
    let pathname = url.parse(ctx.request.url).pathname.substring(1);
    // console.log(pathname.split('/'));

    let splitUrl = pathname.split('/');
    //配置全局信息: 
    ctx.state.G = {
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        //记录上一页从哪里过来：   上一页的地址:
        prevPage:ctx.request.headers['referer']
    }
    if (ctx.session.userinfo) {
        //有
        //继续向下匹配：
        await next();
    } else {
        //判断是否在登陆页面:
        if (pathname == 'admin/login' || pathname == 'admin/login/dologin' || pathname == 'admin/login/code') {
            //在登录页面:
            await next();
        } else {
            //没有在登陆页面
            ctx.redirect('/admin/login')
        }
    }
    
    
})

//引入子模块：
var login = require('./admin/login');
var user = require('./admin/user');
var manage = require('./admin/mange');
var index = require('./admin/index');
var articlecate = require('./admin/articlecate');
var article = require('./admin/article');
var focus = require('./admin/focus');
var link = require('./admin/link')
var nav = require('./admin/nav')
router.get('/', async (ctx) => {
    // ctx.body = '后台管理页面'
    await ctx.render('admin/index')
})



router.use('/login', login);
router.use('/user', user);
router.use('/manage', manage);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use(index);


//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


//暴露：
module.exports = router.routes();