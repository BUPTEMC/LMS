var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
var sd = require('silly-datetime');
var dateFormat = require('dateformat');
var uploadcertificate = require('./../model/upload-certificate');//上传培训合格证明model
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
// 查询列表页
router.get('/', function(req, res, next) {
    pool.getConnection(function (err, connection) {
    	var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM train order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/train', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
// 新建培训
router.get('/newTrain', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var year_,num_,last,num,year,ym;
        ym = dateFormat(new Date(), "yyyymm");
        connection.query("SELECT * FROM train", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length > 0) {
                    last = rows.length - 1;
                    year_ = rows[last].year;
                    num_ = rows[last].num;
                    year = sd.format(new Date(), 'YYYY');
                    ym = dateFormat(new Date(), "yyyymm");
                    if (year == year_) {
                        num_++;
                        num = num_;
                    }
                    else {
                        num = 1;
                    }
                }
                else {
                    year = sd.format(new Date(), 'YYYY');
                    num = 1;
                }
                var tid = ym + "-PX-" + (Array(4).join('0') + num).slice(-4);
                res.render('train/newTrain', {tid:tid,id:id,password:password,name:name,year:year,num:num}); 
            }
        });  
        connection.release();
    });
});
router.get('/clearTrain', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT name FROM train WHERE name='" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (rows.length == 0) {
                        res.send("no");
                    }
                    else {
                        res.send("yes");
                    }
                }
            });
            connection.release();
        }    
    });    
});
router.post('/newTrain', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var year = "" + req.body.year;
        var num = "" + req.body.num;
        var tid = "" + req.body.tid;
        var name = "" + req.body.name;
        var type = "" + req.body.type;
        var newDate = dateFormat(new Date(), "yyyy-mm-dd");
        connection.query('INSERT INTO train(tid,applicant_id,applicant_name,member,year,num,name,type,date) VALUES(?,?,?,?,?,?,?,?,?)', [tid,id,cname,cname,year,num,name,type,newDate], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/train?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
// 新建培训
router.get('/trainDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows[0].type == "外出培训") {
                    res.render('train/trainDetail_1', {datas:rows[0],id:id,password:password,name:name});
                }
                else {
                    res.render('train/trainDetail_2', {datas:rows[0],id:id,password:password,name:name});
                }
            }
        });  
        connection.release();
    });
});
// 外出培训权限
router.post('/outsideauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var flag = 0;
        connection.query("SELECT * FROM train WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows[0].applicant_id !== id) {
                    flag = 1;
                }
                connection.query("SELECT * FROM train_outside WHERE tid='" + tid + "' AND (opinion='同意' or opinion IS NULL)", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        if (flag == 1) {
                            return res.json({
                                errCode : 0,
                                errMsg : '仅本人有权访问'
                            });
                        }
                        if(rows.length !== 0) {
                            return res.json({
                                errCode : 0,
                                errMsg : '已提交过申请'
                            });                
                        }                                 
                        res.json({
                            errCode : 1,
                            errMsg : '满足权限条件'
                        });
                    }
                });
            }
        });              
        connection.release();   
    });
});
// 外出培训详情权限
router.post('/outsidedetailauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成申请'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
// 外出培训申请
router.get('/outsideApply', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var tname = rows[0].name;
                connection.query("SELECT * FROM train_outside", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        var serialNumber = rows.length + 1;
                        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.render('train/outsideApply', {datas:rows[0],id:id,password:password,name:name,tname:tname,serialNumber:serialNumber,tid:tid});
                            }
                        });
                    }
                });
            }
        });  
        connection.release();
    });
});
router.post('/outsideApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var tid = "" + param.tid;
        // 表单
        var serialNumber = "" + req.body.serialNumber;
        var uid = "" + req.body.uid;
        var uname = "" + req.body.uname;
        var department = "" + req.body.department;
        var duty = "" + req.body.duty;
        var tname = "" + req.body.tname;
        var organization = "" + req.body.organization;
        var start_time = "" + req.body.start_time;
        var end_time = "" + req.body.end_time;
        var affair = "请确认外出培训申请";
        var one = 1;
        connection.query("SELECT * FROM user WHERE duty REGEXP '技术负责人'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                var link = '/train/outsideapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&serialNumber=' + serialNumber + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('INSERT INTO train_outside(tid,uid,uname,department,duty,tname,organization,start_time,end_time) VALUES(?,?,?,?,?,?,?,?,?)', [tid,uid,uname,department,duty,tname,organization,start_time,end_time], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/train/trainDetail?id=" + id + "&password=" + password + "&name=" + cname + "&tid=" + tid + "';</script>");
                            }
                        }); 
                    }
                });
            }
        });     
        connection.release();
    });  
});
// 外出培训申请
router.get('/outsideapplyCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var serialNumber = "" + param.serialNumber;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM train_outside WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/outsideapplyCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime});
            }
        });  
        connection.release();
    });
});
router.post('/outsideapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var longTime = "" + req.body.longTime;
        var serialNumber = "" + req.body.serialNumber;
        var opinion = "" + req.body.opinion;
        var opinionRemarks = "" + req.body.remarks;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE train_outside set techName=?,opinion=?,opinionRemarks=? WHERE serialNumber=?', [cname,opinion,opinionRemarks,serialNumber], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        res.send("<script>alert('提交成功!');window.location.href = '/homePage?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                    }      
                });
            }
        });
        connection.release();
    });  
});
router.get('/outside', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside WHERE tid='" + tid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/outside', {datas:rows[0],id:id,password:password,name:name});
            }
        });  
        connection.release();
    });
});
router.get('/outsideRecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/outsideRecord', {datas:rows[0],id:id,password:password,name:name,tid:tid});
            }
        });  
        connection.release();
    });
});
router.post('/outsideRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var tid = "" + req.body.tid;
        var uname = "" + req.body.uname;
        var department = "" + req.body.department;
        var duty = "" + req.body.duty;
        var tname = "" + req.body.tname;
        var organization = "" + req.body.organization;
        var start_time = "" + req.body.start_time;
        var end_time = "" + req.body.end_time;
        var content = "" + req.body.content;
        var result = "" + req.body.result;
        connection.query('INSERT INTO train_outside_record(tid,uname,department,duty,tname,organization,start_time,end_time,content,result) VALUES(?,?,?,?,?,?,?,?,?,?)', [tid,uname,department,duty,tname,organization,start_time,end_time,content,result], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.send("<script>alert('提交成功');window.location.href = '/train/trainDetail?id=" + id + "&password=" + password + "&name=" + cname + "&tid=" + tid + "';</script>");
            }
        });
        connection.release();
    });  
});
router.get('/outsideRecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/outsideRecord', {datas:rows[0],id:id,password:password,name:name,tid:tid});
            }
        });  
        connection.release();
    });
});
// 外出培训记录详情权限
router.post('/recordauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside_record WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成记录'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
router.get('/outsiderecordDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_outside_record WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/outsiderecordDetail', {datas:rows[0],id:id,password:password,name:name,tid:tid});
            }
        });  
        connection.release();
    });
});
// 上传分包方报告
router.post('/certificateUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var tid = "" + param.tid;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadcertificate.uploadPhoto(req,'images',function(err,fields,uploadPath){
            if(err){
                return res.json({
                    errCode : 0,
                    errMsg : '上传错误'
                });
            }
            console.log(fields);    //表单中字段信息
            console.log(uploadPath);    //上传图片的相对路径
            connection.query("UPDATE train SET certificate='" + uploadPath + "' WHERE tid='" + tid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                }
            }); 
            connection.release();  
            res.json({
                errCode : 1,
                errMsg : '上传成功',
                fields :  fields,
                uploadPath : uploadPath
            });
        });         
    });
});
// 人员培训权限
router.post('/manpowerauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "' AND (opinion='同意' or opinion IS NULL)", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length !== 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '已提交过申请'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
// 人员培训申请
router.get('/manpowerApply', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var tname = "" + param.tname;
        var type = "" + param.type;
        connection.query("SELECT * FROM train_manpower", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var serialNumber = rows.length + 1;
                res.render('train/manpowerApply', {id:id,password:password,name:name,tname:tname,tid:tid,serialNumber:serialNumber});
            }
        });
        connection.release();
    });
});
router.post('/manpowerApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var serialNumber = "" + req.body.serialNumber;
        var tid = "" + req.body.tid;
        var tname = "" + req.body.tname;
        var start_time = "" + req.body.start_time;
        var end_time = "" + req.body.end_time;
        var site = "" + req.body.site;
        var department = "" + req.body.department;
        var target = "" + req.body.target;
        var content = "" + req.body.content;
        var affair = "请确认人员培训计划申请";
        connection.query("SELECT * FROM user WHERE duty REGEXP '测试技术部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                var link = '/train/manpowerapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&serialNumber=' + serialNumber + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('INSERT INTO train_manpower(tid,tname,start_time,end_time,site,department,target,content) VALUES(?,?,?,?,?,?,?,?)', [tid,tname,start_time,end_time,site,department,target,content], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/train/trainDetail?id=" + id + "&password=" + password + "&name=" + cname + "&tid=" + tid + "';</script>");
                            }
                        }); 
                    }
                });
            }
        });     
        connection.release();
    });  
});
// 人员培训详情权限
router.post('/manpowerdetailauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成申请'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
router.get('/manpowerapplyCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var serialNumber = "" + param.serialNumber;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM train_manpower WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('train/manpowerapplyCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime});
            }
        });  
        connection.release();
    });
});
router.post('/manpowerapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var longTime = "" + req.body.longTime;
        var serialNumber = "" + req.body.serialNumber;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE train_manpower set testName=?,opinion=?,remarks=? WHERE serialNumber=?', [cname,opinion,remarks,serialNumber], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        res.send("<script>alert('提交成功!');window.location.href = '/homePage?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                    }      
                });
            }
        });
        connection.release();
    });  
});
router.get('/manpower', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var type = "" + param.type;
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var title = "人员培训计划详情";
                res.render('train/manpower', {datas:rows[0],id:id,password:password,name:name,title:title});
        }
        });  
        connection.release();
    });
});
// 人员培训记录权限
router.post('/manpowerrecordauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var flag = 0;
        connection.query("SELECT * FROM train_manpower_record WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length !== 0) {
                    flag = 1;               
                }
            }
        }); 
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (flag == 1) {
                    return res.json({
                        errCode : 0,
                        errMsg : '已填写记录'
                    }); 
                }
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成申请'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
router.get('/manpowerrecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var type = "" + param.type;
        var department,people;
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var datas = rows[0];
                connection.query("SELECT department FROM train_manpower WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        department = rows[0].department;
                        connection.query("SELECT userName FROM user", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                people = rows;
                                connection.query("SELECT userName FROM user WHERE state='在职'", function (err, rows) {
                                    if (err) {
                                        res.status(404).end(); 
                                    } 
                                    else {
                                        var title = "人员培训记录";
                                        res.render('train/manpowerrecord', {people:people,datas:datas,datas1:rows,id:id,password:password,name:name,tid:tid,title:title});  
                                    }
                                });
                            }
                        });
                    }
                }); 
            }
        });  
        connection.release();
    });
});
router.post('/manpowerrecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var tid = "" + req.body.tid;
        var tname = "" + req.body.tname;
        var start_time = "" + req.body.start_time;
        var end_time = "" + req.body.end_time;
        var site = "" + req.body.site;
        var teacher = "" + req.body.teacher;
        var target = "" + req.body.target;
        var content = "" + req.body.content;
        var result = "" + req.body.result;
        var recorder = "" + req.body.recorder;
        connection.query('INSERT INTO train_manpower_record(tid,tname,start_time,end_time,site,teacher,target,content,result,recorder) VALUES(?,?,?,?,?,?,?,?,?,?)', [tid,tname,start_time,end_time,site,teacher,target,content,result,recorder], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.send("<script>alert('提交成功');window.location.href = '/train/trainDetail?id=" + id + "&password=" + password + "&name=" + cname + "&tid=" + tid + "';</script>");
            }
        });
        connection.release();
    });  
});
router.post('/manpowerdetailrecordauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_manpower_record WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成培训记录'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
router.get('/manpowerdetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var type = "" + param.type;
        connection.query("SELECT * FROM train_manpower_record WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var title = "人员培训记录详情";
                res.render('train/manpowerdetail', {datas:rows[0],id:id,password:password,name:name,tid:tid,title:title});
            }
        });  
        connection.release();
    });
});
// 人员考核记录权限
router.post('/checkrecotdauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var department;
        var flag = 0;
        var flag2 = 0;
        connection.query("SELECT department FROM train_manpower WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (rows.length == 0) {
                return res.json({
                    errCode : 0,
                    errMsg : '未完成申请'
                });  
            } 
            else {
                department = rows[0].department;
                connection.query("SELECT department FROM user WHERE id=" + id, function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        if (department.indexOf(rows[0].department) == -1) {
                            flag = 1;
                        }
                        connection.query("SELECT * FROM train_manpower_record WHERE tid='" + tid + "'", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                if(rows.length == 0) {
                                    flag2 = 1;               
                                }
                                connection.query("SELECT * FROM train_manpower_check WHERE tid='" + tid + "'", function (err, rows) {
                                    if (err) {
                                        res.status(404).end(); 
                                    } 
                                    else {
                                        if(flag == 1) {
                                            return res.json({
                                                errCode : 0,
                                                errMsg : '您所在部门无权填写'
                                            });          
                                        }
                                        if(flag2 == 1) {
                                            return res.json({
                                                errCode : 0,
                                                errMsg : '未填写记录'
                                            });          
                                        }
                                        if(rows.length !== 0) {
                                            return res.json({
                                                errCode : 0,
                                                errMsg : '已填写考核记录'
                                            });          
                                        }
                                        res.json({
                                            errCode : 1,
                                            errMsg : '满足权限条件'
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }); 
                    
        connection.release();   
    });
});
router.get('/checkrecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var type = "" + param.type;
        connection.query("SELECT * FROM train_manpower WHERE tid='" + tid + "' AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var datas = rows[0];
                connection.query("SELECT target FROM train_manpower_record WHERE tid='" + tid + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        var title = "人员考核记录";
                        res.render('train/checkrecord', {datas:datas,datas1:rows[0],id:id,password:password,name:name,tid:tid,title:title});
                    }
                });
            }
        });  
        connection.release();
    });
});
router.post('/checkrecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var tid = "" + req.body.tid;
        var tname = "" + req.body.tname;
        var department = "" + req.body.department;
        var score = "" + req.body.score;
        var target = "" + req.body.target;
        var recorder = "" + req.body.recorder;
        var targets = target.split(",");
        var scores = score.split(",");
        for (var i = 0; i < targets.length; i++) {
            (function(i) {
                connection.query("SELECT * FROM user WHERE userName='" + targets[i] + "'", function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        if (rows[0].train_id == null) {
                            connection.query('UPDATE user set train_id=? WHERE userName=?', [tid,targets[i]], function (err, rows) {
                                if (err) {
                                    res.status(404).end(); 
                                }
                            });
                        }
                        else {
                            connection.query("UPDATE user SET train_id=CONCAT(train_id,'," + tid + "') WHERE userName='" + targets[i] + "'", function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                }     
                            });
                        }
                    }        
                });
            })(i);
        }
        connection.query('INSERT INTO train_manpower_check(tid,tname,department,target,score,recorder) VALUES(?,?,?,?,?,?)', [tid,tname,department,target,score,recorder], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.send("<script>alert('提交成功');window.location.href = '/train/trainDetail?id=" + id + "&password=" + password + "&name=" + cname + "&tid=" + tid + "';</script>");
            }
        });
        connection.release();
    });  
});
router.post('/checkrecorddetailauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        connection.query("SELECT * FROM train_manpower_check WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成考核记录'
                    });                
                }                                 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });              
        connection.release();   
    });
});
router.get('/checkrecorddetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var tid = "" + param.tid;
        var type = "" + param.type;
        connection.query("SELECT * FROM train_manpower_check WHERE tid='" + tid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var title = "人员考核记录详情";
                res.render('train/checkrecorddetail', {datas:rows[0],id:id,password:password,name:name,tid:tid,title:title});   
            }
        });  
        connection.release();
    });
});
// 查看权限
router.get('/explain', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        res.render('train/explain', {id:id,password:password,name:name});
        connection.release();   
    });    
});
module.exports = router;