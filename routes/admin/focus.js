
const 
    Router = require('koa-router'),
    router = new Router();


var DB=require('../../module/db');


var tools=require('../../module/tools');





router.get('/',async (ctx)=>{

    var page=ctx.query.page ||1;
    var pageSize=3;
    var result= await DB.find('focus',{},{},{
        page,
        pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    // console.log(result);
    var count= await  DB.count('focus',{});  /*总数量*/
    await  ctx.render('admin/focus/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})


router.get('/add',async (ctx)=>{

    await ctx.render('admin/focus/add')

})

router.post('/doAdd', tools.multer().single('pic'),async (ctx)=>{

    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}

    let title=ctx.req.body.title.trim();
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let status=ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let url = ctx.req.body.url;
    let add_time=tools.getTime();

    //console.log(img_url);
    //添加到数据库:
    await DB.insert('focus',{
        title,pic,status,sort,url,add_time
    });

    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/focus');


})


router.get('/edit',async (ctx)=>{

    let id = ctx.query.id;

    let result = await DB.find('focus',{
        "_id":DB.getObjectId(id)
    })
    // console.log(result);
    await ctx.render('admin/focus/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    })
})


router.post('/doEdit', tools.multer().single('pic'),async (ctx)=>{

    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}
    let prevPage = ctx.req.body.prevPage;
    let id =ctx.req.body.id;
    let title=ctx.req.body.title.trim();
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let status=ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let url = ctx.req.body.url;
    let add_time=tools.getTime();

    if(pic){
        var json = {
            title,pic,status,sort,url,add_time
        }
    }else{
        var json = {
            title,status,sort,url,add_time
        }
    }
    //console.log(img_url);
    //添加到数据库:
    await DB.update('focus',{"_id":DB.getObjectId(id)},json);

    if(prevPage){
        ctx.redirect(prevPage)
    }else{
        
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/focus');
    }


})



module.exports=router.routes();