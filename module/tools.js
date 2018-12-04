const
    multer = require('koa-multer'),
    md5 = require('md5');
//配置上传图片中间件:

let tools = {


    multer() {


        //上传图片的配置:
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {


                cb(null, 'public/upload'); /*配置图片上传的目录     注意：图片上传的目录必须存在*/
            },
            filename: function (req, file, cb) { /*图片上传完成重命名*/
                var fileFormat = (file.originalname).split("."); /*获取后缀名  分割数组*/
                cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({
            storage: storage
        });

        return upload
    }, 

    getTime() {
        return new Date()
    },

    md5(str) {

        return md5(str)

    },

    cateToList(data) {


        //1、获取一级分类

        var firstArr = [];

        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == '0') {
                firstArr.push(data[i]);
            }
        }
        //2、获取二级分类
        //console.log(firstArr);

        for (var i = 0; i < firstArr.length; i++) {

            firstArr[i].list = [];
            //遍历所有的数据  看那个数据的pid等于当前的数据_id
            for (var j = 0; j < data.length; j++) {
                if (firstArr[i]._id == data[j].pid) {
                    firstArr[i].list.push(data[j]);
                }
            }

        }
        // console.log(firstArr);

        return firstArr;
    }

}



module.exports = tools;