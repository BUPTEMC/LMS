// 导入MySql模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
      res.json({
          code: '-200',
          msg: '操作失败'
      });
    } else {
      res.json(ret);
    }
};
// 添加用户
router.get('/addUser',function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        // 建立连接 添加一个用户信息
        connection.query(userSQL.insert, [param.uid,param.name], function (err, result) {
            if(result) {
              result = {
                code: 200,
                msg: '添加成功'
              };
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放链接
            connection.release();

        });
    });
});
// 用户登录
router.post('/login',function (req, res, next) {
    var Userid = req.body.id;
    var Password = req.body.password;
    Userid = Userid.replace(/\s+/g,"");
    Password = Password.replace(/\s+/g,"");
    // 将用户密码做md5加密
    var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    md5.update(Password);
    var password_alter = md5.digest('hex');  //加密后的值d
    var _res = res;
    // 管理员
    if(Userid == 'admin' && Password == '000000'){
        var md5_admin = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5_admin.update("000000");
        var password_admin = md5_admin.digest('hex');  //加密后的值d
        var adminPage = "/admin?id=admin&password=" + password_admin;
        res.redirect(adminPage);
    }
    pool.getConnection(function (err, connection) {
   
        connection.query("select * from user where id=" + Userid + " and password='" + password_alter + "'", function (err, rows) {
            if (err) {
                res.end(err)
            } 
            // 查询无结果重定向登录
            else if(rows.length == 0){
                res.redirect('/');
            }
            // 查到重定向主页
            else {
                var page = "/homePage?id=" + rows[0].id + "&password=" + rows[0].password + "&name=" + rows[0].userName;
                res.redirect(page);
            }
        connection.release();
        });
    });
});
// 用户注册
router.get('/reg',function (req, res, next) {
    // 从连接池获取连接
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        var UserName = param.name;
        var _res = res;
        connection.query(userSQL.insert, [UserName], function (err, rows) {
            if (err) {
                res.end(err);
            } else {
                res.end('succeed');
            }
            connection.release();
        });
    });
});
// 删除用户
// router.get('/delUser',function (req, res, next) {
//     var _res = res;
//     pool.getConnection(function (err, connection) {
//         var param = req.query || req.params;
//         connection.query(userSQL.delete, [param.uid], function (err, result, res) {
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '刪除成功'
//                 };
//             }
//             responseJSON(_res, result);
//             connection.release();
//         })
//     })
// });
// 更新用户
// router.get('/updateUser',function (req, res, next) {
//     pool.getConnection(function (err, connection) {
//         var param = req.query || req.params;
//         connection.query(userSQL.update, [param.uid,param.name], function (err, result) {
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '修改成功'
//                 };
//             }
//             responseJSON(res, result);
//             connection.release();
//         });
//     });
// });
// 删除用户表
// router.get('/dropUser',function (req, res, next) {
//     pool.getConnection(function (err, connection) {
//         // var param = req.query || req.params;
//         connection.query(userSQL.drop, function (err, result) {
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '清除成功'
//                 };
//             }
//             responseJSON(res, result);
//             connection.release();
//         });
//     });
// });
// 查询用户表
// router.get('/queryAllUser',function (req, res, next) {
//     var _res = res;
//     pool.getConnection(function (err, connection) {
//         connection.query(userSQL.queryAll, function (err, result, res) {
//             console.log(res);
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '查询成功'
//                 };
//             }
//             responseJSON(_res, result);
//             connection.release();
//         });
//     });
// });
// 查询用户
// router.get('/getUserByIdUser',function (req, res, next) {
//     pool.getConnection(function (err, connection) {
//         var param = req.query || req.params;
//         connection.query(userSQL.getUserById, [param.name], function (err, result) {
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '查询成功'
//                 };
//             }
//             responseJSON(res, result);
//             connection.release();
//         });
//     });
// });
// 模糊查询
// router.get('/getUsers',function (req, res, next) {
//     pool.getConnection(function (err, connection) {
//         var param = req.query || req.params;
//         connection.query(userSQL.getUsers, [param.uid], function (err, result) {
//             if(result) {
//                 result = {
//                     code: 200,
//                     msg: '查询成功'
//                 };
//             }
//             responseJSON(res, result);
//             connection.release();
//         });
//     });
// });
/* GET users listing. */
// 查询列表页
router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.getUserInfo, function (err, rows) {
            if (err) {
                res.render('users', {title:'Express',datas:[]}); // this renders "views/user.html"
            } else {
                res.render('users', {title:'Express',datas:rows});
            }
            connection.release();
        });
    });
});
// 新增人员页面跳转
router.get('/add',function (req, res) {
    var param = req.query || req.params;
    var id = "" + param.id;
    var password = "" + param.password;
    res.render('add', {id:id,password:password})
});
router.post('/add', function (req, res) {
    var name = req.body.name;
    var duty = "";
    duty += req.body.duty;
    name = name.replace(/\s+/g,"");
    duty = duty.replace(/,/g," ");
    // 加密原始密码aptx4869
    var ori_password = "aptx4869";
    var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称
    md5.update(ori_password);
    var password = md5.digest('hex');  //加密后的值d
    // 输入空格或未输入内容重定向
    if (name == ''|| duty == 'undefined') {
        res.redirect('/users/add');
    }
    else{
        pool.getConnection(function (err, connection) {
            connection.query(userSQL.insert, [password,name,duty], function (err, rows) {
                if (err) {
                    res.end('fail:' + err);
                } else {
                res.redirect('/admin');
                }
            connection.release();
            });
        });  
    }
    
});
// 删
router.get('/del/:id', function (req, res) {
    var id = req.params.id;
    pool.getConnection(function (err, connection) {
        connection.query("delete from user where id=" + id, function (err, rows) {
            if (err) {
                res.end('删除失败:' + err);
            } else {
                res.redirect('/admin');
            }
            connection.release();

        });
    });

});
// 修改密码
router.post('/change',function(req, res){
    pool.getConnection(function(err,connection){
        var password0 = req.body.password0;
        var password1 = req.body.password1;
        var password2 = req.body.password2;
        password0 = password0.replace(/\s+/g,"");
        password1 = password1.replace(/\s+/g,"");
        password2 = password2.replace(/\s+/g,"");
        var param = req.query || req.params;
        var id = "";
        var password = "";
        var name = "";
        id += param.id;
        password += param.password;
        name += param.name;
        var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        md5.update(password0);
        var password0_alter = md5.digest('hex');  //加密后的值d
        // 密码不一致重定向
        if (password0_alter !== password) {
            var page = "/homePage/personal?id=" + id + "&password=" + password + "&name=" + name;
            res.redirect(page);
        }
        if(password1 !== password2){
            var page = "/homePage/personal?id=" + id + "&password=" + password + "&name=" + name;
            res.redirect(page);
        }
        // 修改密码后重新登录
        else{
            // 在数据库中存储md5加密后的密码
            var md5 = crypto.createHash('md5');//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
            md5.update(password1);
            var password_alter = md5.digest('hex');  //加密后的值d
            connection.query("update user set password='" + password_alter + "' where id=" + id, function (err, rows) {
                if (err) {
                    res.end('fail:' + err);
                } else {
                    res.redirect('/');
                }
                connection.release();
            });            
        }
    });
});
// 停止服务
router.get('/disable/:id',function(req, res){
    var id = req.params.id;
    var password = "goodbye";
    var duty = "";
    pool.getConnection(function(err,connection){
        connection.query("update user set password='" + password + "',duty='" + duty + "',state='离职' where id=" + id, function (err, rows) {
            if (err) {
                res.end('修改失败:' + err);
            } else {
                res.redirect('/admin');
            }
            connection.release();
        });
    });
});
// 修改
router.get('/toUpdate/:id', function (req, res) {
    var id = req.params.id;
    console.log(id)
    pool.getConnection(function (err, connection) {
        connection.query("select * from user where id=" + id, function (err, rows) {
            console.log(rows)
            if (err) {
                res.end('修改页面跳转失败:' + err);
            } else {
                res.render('update', {datas: rows}); //直接跳转
            }
            connection.release();
        });
    });
});
router.post('/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var age = req.body.age;
    console.log(id)
    console.log(name)
    console.log(age)
    pool.getConnection(function (err, connection) {
        connection.query("update userInfo set name='" + name + "',age='" + age + "' where id=" + id, function (err, rows) {
            if (err) {
                res.end('修改失败:' + err);
            } else {
                res.redirect('/users');
            }
            connection.release();
        });
    });
});
// 查询
// router.post('/search',function (req, res) {
//    var name = req.body.s_name;
//    var age = req.body.s_age;
//    var sql = "select * from userInfo";
//    if (name) {
//        sql += " and name='" + name + "' ";
//    }
//    if (age) {
//        sql += " and age=" + age + " ";
//    }
//    sql = sql.replace("and","where");
//     pool.getConnection(function (err, connection) {
//         connection.query(sql, function (err, rows) {
//             if (err) {
//                 res.end("查询失败：", err)
//             } else {
//                 res.render("users", {title: 'Express', datas: rows, s_name: name, s_age: age});
//             }
//             connection.release();
//         });
//     });
// });
module.exports = router;