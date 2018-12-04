const
    Router = require('koa-router');

var router = new Router();
var DB = require('../../module/db');
var tools = require('../../module/tools');


router.get('/', async (ctx) => {

    var result = await DB.find('articlecate', {});
    // console.log(result);
    // ctx.body = '后台分类页面'
    await ctx.render('admin/articlecate/index',{
        list: tools.cateToList(result)
    })
})


router.get('/add', async (ctx) => {
    // ctx.body = '后台登陆页面'
    
    //获取一级分类:
    let result = await DB.find('articlecate',{'pid':'0'})
    
    // console.log(result);
    await ctx.render('admin/articlecate/add',{
        catelist:result
    });
})


router.post('/doAdd',async(ctx)=>{
    // console.log(ctx.request.body);
    //获取表单提交的数据:
    let addData = ctx.request.body;
    // console.log(addData);
    //添加数据到数据库:
    DB.insert('articlecate',addData)

    //跳转:
    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate')
})


router.get('/edit',async(ctx)=>{
    //  ctx.body = '编辑页面';

    //获取到传来的id:
    let id = ctx.query.id;
    //获取数据库对应要编辑的数据:
    let result = await  DB.find('articlecate',{"_id":DB.getObjectId(id)});
    var articlecate=await DB.find('articlecate',{'pid':'0'});
    //渲染:
    await ctx.render('admin/articlecate/edit',{
        list:result[0],
        catelist:articlecate
    })

})

router.post('/doEdit',async (ctx)=>{


    let editData=ctx.request.body;
    let id=editData.id;       /*前台设置隐藏表单域传过来*/
    let title=editData.title;
    let pid=editData.pid;
    let keywords=editData.keywords;
    let status=editData.status;
    let description=editData.description;

    let result=await DB.update('articlecate',{'_id':DB.getObjectId(id)},{
        title,pid,keywords,status,description
    });

    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');

})
//暴露：
module.exports = router.routes();