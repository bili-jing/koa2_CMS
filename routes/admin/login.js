const
    Router = require('koa-router'),
    tools = require('../../module/tools'),
    DB = require('../../module/db'),
    svgCaptcha = require('svg-captcha');

//实例化路由:
var router = new Router();

router.get('/', async (ctx) => {
    // ctx.body = '后台登陆页面'
    await ctx.render('admin/login')
})

router.post('/dologin', async (ctx) => {
    //获取到表单提交信息:
    // console.log(ctx.request.body);

    //获取表单信息：
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    // console.log(tools.md5(password));

    //接受验证码:
    let code = ctx.request.body.code;
    
    if (code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()) {

        //后台验证用户名密码是否合法

        let result = await DB.find('admin', {
            "username": username,
            "password": tools.md5(password)
        });

        if (result.length > 0) {
            // console.log('登陆成功');
            // console.log(result);

            ctx.session.userinfo = result[0];


            //更新用户表   改变用户登陆时间:

             await DB.update('admin',{"_id":DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            })
            ctx.redirect(ctx.state.__HOST__ + '/admin')
        } else {
            // console.log('登陆失败');
            ctx.render('admin/error',{
                message:'用户或者密码错误',
                redirect:ctx.state.__HOST__+'/admin/login'
            })
        }
    } else {
        ctx.render('admin/error',{
            message:'验证码错误',
            redirect:ctx.state.__HOST__+'/admin/login'
        })
    }
})

router.get('/code', async (ctx) => {
    //  ctx.body = '验证码页面'
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 100,
        height: 34,
        background: "#cc9966"
    });

    //保存验证码:
    ctx.session.code = captcha.text;

    //设置响应头:
    ctx.response.type = 'image/svg+xml';
    // console.log(captcha.text);
    ctx.body = captcha.data
})


router.get('/loginOut', async (ctx) => {
    
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__+'/admin/login')
})

//暴露：
module.exports = router.routes();