const
    Router = require('koa-router');

var router = new Router();

//引入db库:
var DB = require('../../module/db');
var tools = require('../../module/tools')

router.get('/', async (ctx) => {

    //获取到管理员信息:
    var result = await DB.find('admin', {});
    // console.log(result);
    // ctx.body = '后台登陆页面'
    await ctx.render('admin/manage/list', {
        list: result
    })
})


router.get('/add', async (ctx) => {
    // ctx.body = '后台登陆页面'
    await ctx.render('admin/manage/add')
})

router.post('/doAdd', async (ctx) => {
    //获取表单提交的数据：
    // console.log(ctx.request.body);

    //2.验证表单数据是否合法：


    //3.在数据库中查询当前要增加的管理员是否存在


    // 4.增加管理员

    //获取表单提交的数据：
    var username = ctx.request.body.username;
    var password = ctx.request.body.password;
    var rpassword = ctx.request.body.rpassword;


    //2.验证表单数据是否合法：
    if (!/^\w{4,20}/.test(username)) {

        await ctx.render('admin/error', {
            message: '用户名不合法',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })

    } else if (password.trim() != rpassword.trim() || password.trim().length < 6) {

        await ctx.render('admin/error', {
            message: '密码和确认密码不一致，或者密码长度小于6位',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })

    } else {

        //数据库查询当前管理员是否存在

        var findResult = await DB.find('admin', {
            "username": username
        });

        if (findResult.length > 0) {

            await ctx.render('admin/error', {
                message: '次管理员已经存在，请换个用户名',
                redirect: ctx.state.__HOST__ + '/admin/manage/add'
            })

        } else {

            //增加管理员
            var addResult = await DB.insert('admin', {
                "username": username,
                "password": tools.md5(password),
                "status": 1,
                "last_time": ''
            });

            ctx.redirect(ctx.state.__HOST__ + '/admin/manage');

        }


    }
})


router.get('/edit', async (ctx) => {

    //获取到id:
    var id = ctx.query.id;
    
    //查询数据库是否有此数据:
    var result = await DB.find('admin',{
        "_id":DB.getObjectId(id)
    })

    ctx.render('admin/manage/edit',{
        list:result[0]
    })

    
    // ctx.body = "编辑用户";

})

router.post('/doEdit',async (ctx)=>{

    try{
        var id=ctx.request.body.id;
        // console.log(id);
        var username=ctx.request.body.username;
        var password=ctx.request.body.password;
        var rpassword=ctx.request.body.rpassword;

        if(password.trim()!=''){
            if(password.trim() !=rpassword.trim() ||password.trim().length<6){

                await ctx.render('admin/error',{
                    message:'密码和确认密码不一致，或者密码长度小于6位',
                    redirect:ctx.state.__HOST__+'/admin/manage/edit?id='+id
                })

            }else{

                //更新密码
                var updateResult=await DB.update('admin',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect(ctx.state.__HOST__+'/admin/manage');
            }
        }else{

            ctx.redirect(ctx.state.__HOST__+'/admin/manage');
        }

    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/manage/edit?id='+id
        })

    }
})

// router.get('/delete', async (ctx) => {

//     ctx.body = "删除用户";

// })
//暴露：
module.exports = router.routes();