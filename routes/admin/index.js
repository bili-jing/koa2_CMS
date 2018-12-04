/**
 * Created by Administrator on 2018/3/20 0020.
 */
var Router = require('koa-router');
var router = new Router();
const DB = require('../../module/db')

router.get('/', async (ctx) => {
    ctx.render('admin/index');
})


router.get('/changeStatus', async (ctx) => {
    // console.log(ctx.query);

    var collectionName = ctx.query.collectionName; /*数据库表*/
    var attr = ctx.query.attr; /*属性*/
    var id = ctx.query.id; /*更新的 id*/

    var data = await DB.find(collectionName, {
        "_id": DB.getObjectId(id)
    });
    if (data.length > 0) {
        if (data[0][attr] == 1) {
            var json = { 
                [attr]: 0
            };
        } else {
            var json = {
                [attr]: 1
            };
        }
        let updateResult = await DB.update(collectionName, {
            "_id": DB.getObjectId(id)
        }, json);

        if (updateResult) {
            ctx.body = {
                "message": '更新成功',
                "success": true
            };
        } else {
            ctx.body = {
                "message": "更新失败",
                "success": false
            }
        }
    } else {
        ctx.body = {
            "message": '更新失败,参数错误',
            "success": false
        };
    }
})


//改变排序的ajax接口


router.get('/changeSort',async (ctx)=>{

    //console.log(ctx.query);

    var collectionName=ctx.query.collectionName; /*数据库表*/
    var id=ctx.query.id;
    var sortValue=ctx.query.sortValue;
    //更新的数据

    var json={

        sort:sortValue
    }
    let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);

    if(updateResult){
        ctx.body={"message":'更新成功',"success":true};
    }else{
        ctx.body={"message":"更新失败","success":false}
    }

})



/*公共的删除方法*/
router.get('/remove',async (ctx)=>{
    //console.log(ctx.query);
    try{
        var collection=ctx.query.collection; /*数据库表*/
        var id=ctx.query.id;   /*删除 id*/

        var result=DB.remove(collection,{"_id":DB.getObjectId(id)});
        //返回到哪里?
        ctx.redirect(ctx.state.G.prevPage);

    }catch(err){
        ctx.redirect(ctx.state.G.prevPage);
    }
})


module.exports = router.routes();