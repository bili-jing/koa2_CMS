//DB库:
var MongoClient = require('mongodb').MongoClient;

//导入获取id模块:
const  ObjectId = require('mongodb').ObjectID;

var Config = require('./config.js');

class Db {
        //单例:
    static getInstance() { 

        //判断是否已经实例:
        if (!Db.instance) {
            //没有,则实例化
            Db.instance = new Db();

        }
        //已有实例:
        return Db.instance;
    }

    //结构函数:
    constructor() {

        this.dbClient = '' //存放db对象:

        /* 一开始实例化就链接数据库: */
        this.connect(); //链接数据库

    }

    //连接数据库方法:
    connect() {
        let _that = this;
        return new Promise((resolve, reject) => {

            if (!_that.dbClient) {
                //链接数据库:
                MongoClient.connect(Config.dbUrl, {
                    useNewUrlParser: true
                }, (err, client) => {

                    if (err) {
                        reject(err)

                    } else {

                        _that.dbClient = client.db(Config.dbName);
                        resolve(_that.dbClient);
                    }
                })

            } else {
                resolve(_that.dbClient);

            }

        })
    }

    //查询数据:
    find(collectionName, json1,json2,json3) { 

        if(arguments.length==2){
            var attr={};
            var slipNum=0;
            var pageSize=0;

        }else if(arguments.length==3){
            var attr=json2;
            var slipNum=0;
            var pageSize=0;
        }else if(arguments.length==4){
            var attr=json2;
            var page=json3.page ||1;
            var pageSize=json3.pageSize||20;
            var slipNum=(page-1)*pageSize;
            if(json3.sortJson){
                var sortJson = json3.sortJson;
            }else{
                var sortJson = {}
            }
        }else{
            console.log('传入参数错误')
        }


        return new Promise((resolve, reject) => {
            this.connect().then((db) => {

                let result = db.collection(collectionName).find(json1,{
                    fields:attr
                }).skip(slipNum).limit(pageSize).sort(sortJson)
                result.toArray((err, docs) => {

                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs)
                })
            })
        })
    }

    //新增数据:
    insert(collectionName, json) {

        return new Promise((resolve, reject) => {

            this.connect().then((db) => {

                db.collection(collectionName).insertOne(json, (err, result) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }


                })
            })
        })
    }

    //修改数据：
    update(collectionName, json1, json2) {

        return new Promise((resolve, reject) => {

            this.connect().then((db) => {

                db.collection(collectionName).updateOne(json1, {

                    //更新的数据:
                    $set: json2
                }, (err, result) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }

                })
            })
        })
    }

    //删除数据:
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            
            this.connect().then((db)=>{
                
                //删除数据:
                db.collection(collectionName).removeOne(json,(err,result)=>{
                    
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                    
                })
            })
        })
    }

    //获取get传参形式的id:
    getObjectId(id){
        //mongodb里面查询 _id 把字符串转换成对象
        return new ObjectId(id)
    }
    
    //统计数量的方法
    count(collectionName,json){

        return new  Promise((resolve,reject)=> {
            this.connect().then((db)=> {

                var result = db.collection(collectionName).count(json);
                result.then(function (count) {

                        resolve(count);
                    }
                )
            })
        })

    }
}


module.exports = Db.getInstance();