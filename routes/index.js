const
    Router = require('koa-router');

var router = new Router();


router.get('/', async (ctx) => {

    ctx.render('default/index');
})

router.get('/news', async (ctx) => {

    ctx.render('default/news');

})

router.get('/service', async (ctx) => {

    ctx.render('default/service');

})

router.get('/about', async (ctx) => {

    ctx.render('default/about');

})

router.get('/case', async (ctx) => {

    ctx.render('default/case');

})

router.get('/connect', async (ctx) => {

    ctx.render('default/connect');
})

//暴露：
module.exports = router.routes();