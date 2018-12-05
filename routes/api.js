const 
    Router = require('koa-router');

var router = new Router();
var DB = require('../module/db');



router.get('/',async (ctx)=>{
    ctx.body="api接口";
})


router.get('/catelist',async (ctx)=>{

    var result=await DB.find('articlecate',{})

    //console.log(result);
    ctx.body={
        result:result
    };
})


router.get('/newslist',async (ctx)=>{

    var page=ctx.query.page || 1;

    var pageSize=5

    var result=await DB.find('article',{},{'_id':1,"title":1},{
        page,
        pageSize
    })

    //console.log(result);
    ctx.body={
        result:result
    };
})


//暴露：
module.exports = router.routes();