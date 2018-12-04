

var router = require('koa-router')();

var DB=require('../../module/db');

var tools=require('../../module/tools');


router.get('/',async (ctx)=>{

    let result =await DB.find('setting',{});

    await ctx.render('admin/setting/index',{
        list:result[0]
    });

})


router.post('/doEdit',tools.multer().single('site_logo'),async (ctx)=>{

    //ctx.body='系统设置';
    //获取设置的信息

    var site_title=ctx.req.body.site_title;
    let site_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var site_keywords=ctx.req.body.site_keywords;
    var site_description=ctx.req.body.site_description;
    var site_icp=ctx.req.body.site_icp;
    var site_qq=ctx.req.body.site_qq;
    var site_tel=ctx.req.body.site_tel;
    var site_address=ctx.req.body.site_address;
    var site_status=ctx.req.body.site_status;
    var add_time=tools.getTime();


    if(site_logo){
        var json={
            site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }
    }else{
        var json={
            site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time

        }

    }

    await  DB.update('setting',{},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/setting');

})

module.exports=router.routes();