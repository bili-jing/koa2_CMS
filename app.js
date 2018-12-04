const
    Koa = require('koa'),
    Route = require('koa-router'),
    render = require('koa-art-template'),
    path = require('path'),
    static = require('koa-static'),
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    sd = require('silly-datetime'),
    jsonp = require('koa-jsonp');

//实例化路由:

var app = new Koa();
var router = new Route();


//配置jsonp中间件:
app.use(jsonp());


//配置session中间件:
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  autoCommit: true, 
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: true, 
  renew: false, 
};

app.use(session(CONFIG, app));


//配置模板引擎:
render(app, {
    root: path.join(__dirname, 'views'), //视图
    extname: '.html', //后缀名
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});


//配置静态资源中间件:
// app.use(static('.'));
app.use(static(__dirname + '/public'));


//配置获取提交表单信息中间件:
app.use(bodyParser());

//引入对应子模块:
var index = require('./routes/index');
var api = require('./routes/api');
var admin = require('./routes/admin');

//配置路由: 
router.use('/admin', admin);
router.use('/api', api);
router.use(index);

//启动路由:
app.use(router.routes());
app.use(router.allowedMethods());

//监听端口:
app.listen(8000);