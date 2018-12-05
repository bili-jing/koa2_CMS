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

    //查询

    var serviceList=await DB.find('article',{'pid':'5ab34b61c1348e1148e9b8c2'});


    // console.log(serviceList);

    ctx.render('default/service',{

        serviceList:serviceList
    });

})

router.get('/content/:id',async (ctx)=>{

    // console.log(ctx.params);

    var id=ctx.params.id;

    var content=await  DB.find('article',{'_id':DB.getObjectId(id)});

    // console.log(content);

    ctx.render('default/content',{
        list:content[0]

    });
})

router.get('/about', async (ctx) => {

    //获取成功案列的

    ctx.render('default/about');

})

router.get('/case',async (ctx)=>{


    var pid=ctx.query.pid;

    var page=ctx.query.page || 1;

    var pageSize=4;


    //获取成功案例下面的分类
    var cateResult=await  DB.find('articlecate',{'pid':'5ab3209bdf373acae5da097e'});


    if(pid){
        /*如果存在*/
        var  articleResult=await DB.find('article',{"pid":pid},{},{
            page,
            pageSize
        });
        var  articleNum=await DB.count('article',{"pid":pid});

    }else{

        //循环子分类获取子分类下面的所有的内容
        var subCateArr=[];
        for(var i=0;i<cateResult.length;i++){
            subCateArr.push(cateResult[i]._id.toString());
        }
        var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
            page,
            pageSize
        });

        var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});

    }

    ctx.render('default/case',{
        catelist:cateResult,
        articlelist:articleResult,
        pid:pid,
        page:page,
        totalPages:Math.ceil(articleNum/pageSize)
    });

})

router.get('/connect', async (ctx) => {

    ctx.render('default/connect');
})

//暴露：
module.exports = router.routes();