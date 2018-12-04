/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../module/db');

var tools=require('../../module/tools');


router.get('/',async (ctx)=>{

    var result=await DB.find('nav',{});


    await  ctx.render('admin/nav/list',{
        list:result
    })
})

router.get('/add',async (ctx)=>{

    await  ctx.render('admin/nav/add')
})

//执行增加操作
router.post('/doAdd',async (ctx)=>{

    //接受数据
    // console.log(ctx.req.body);
    var title=ctx.request.body.title;

    var url=ctx.request.body.url;

    var sort=ctx.request.body.sort;

    var status=ctx.request.body.status;

    var add_time=tools.getTime();

    await  DB.insert('nav',{title,url,sort,status,add_time});

    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/nav');


})


router.get('/edit',async (ctx)=>{

    var id=ctx.query.id;


    var result=await DB.find('nav',{"_id":DB.getObjectId(id)});

    await  ctx.render('admin/nav/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

})

//执行增加操作
router.post('/doEdit',async (ctx)=>{

    var id=ctx.request.body.id;

    var title=ctx.request.body.title;

    var url=ctx.request.body.url;

    var sort=ctx.request.body.sort;

    var status=ctx.request.body.status;

    var prevPage=ctx.request.body.prevPage;


    var add_time=tools.getTime();

    await  DB.update('nav',{"_id":DB.getObjectId(id)},{title,url,sort,status,add_time});

    //跳转
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/nav');

    }


})

module.exports=router.routes();