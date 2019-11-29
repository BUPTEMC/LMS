var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
var sd = require('silly-datetime');
var dateFormat = require('dateformat');
var uploadstandard = require('./../model/upload-standard');//上传培训合格证明model
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
        var duty;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 duty = rows[0].duty;
                 connection.query("SELECT * FROM standard WHERE state!='已作废' order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('standard/standard', {datas:rows,id:id,password:password,name:name,duty:duty}); 
                    }
                });
            }
        });
        connection.release();
    });
});
// 新建标准
router.get('/newStandard', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var today = dateFormat(new Date(), "yyyy-mm-dd");
        res.render('standard/newStandard', {id:id,password:password,name:name,today:today}); 
        connection.release();
    });
});
// 上传标准
router.post('/standardUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadstandard.uploadPhoto(req,'images',function(err,fields,uploadPath){
            if(err){
                return res.json({
                    errCode : 0,
                    errMsg : '上传错误'
                });
            }
            console.log(fields);    //表单中字段信息
            console.log(uploadPath);    //上传图片的相对路径
            res.json({
                errCode : 1,
                errMsg : '上传成功',
                fields :  fields,
                uploadPath : uploadPath
            });
        });         
    });
});
router.get('/clearStandard', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT sid FROM standard WHERE sid='" + name + "'", function (err, rows) {
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
router.post('/newStandard', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var sid = "" + req.body.sid;
        var sname = "" + req.body.sname;
        var type = "" + req.body.type;
        var publish_date = "" + req.body.publish_date;
        var implement_date = "" + req.body.implement_date;
        var method_needed = "" + req.body.method_needed;
        var standard_url = "" + req.body.standard_url;
        var state;
        if (method_needed == "是") {
            state = "等待方法确认";
            var last_update_time = "";
            var affair = "请完成新标准方法确认";
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
                    var link = '/standard/standardDetail?id=' + userid + '&password=' + userpassword + '&name=' + username + '&sid=' + sid + '&longTime=' + time;
                    connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                    });
                }
            });
        }
        else {
            state = "正常使用";
            var last_update_time = dateFormat(new Date(), "yyyy-mm-dd");
        }
        connection.query('INSERT INTO standard(sid,sname,type,publish_date,implement_date,standard_url,last_update_time,state,method_needed) VALUES(?,?,?,?,?,?,?,?,?)', [sid,sname,type,publish_date,implement_date,standard_url,last_update_time,state,method_needed], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/standard?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        }); 
        connection.release();
    });  
});
// 标准详情
router.get('/standardDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var sid = "" + param.sid;
        var message_form = "message_" + id;
        var longTime = "" + param.longTime;
        var duty,method_lenth;
        if (longTime !== "") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                }
            });
        }
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 duty = rows[0].duty;
                 connection.query("SELECT * FROM standard_method WHERE sid='" + sid + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        method_lenth = rows.length;
                        connection.query("SELECT * FROM standard WHERE sid='" + sid + "'", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.render('standard/standardDetail', {datas:rows[0],id:id,password:password,name:name,duty:duty,method_lenth:method_lenth}); 
                            }
                        });  
                    }
                });
                 
            }
        }); 
        connection.release();
    });
});
// 新建方法确认
router.get('/newMethod', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var sid = "" + param.sid;
        var sname = "" + param.sname;
        var year_,num_,last,num,year;
        connection.query("SELECT * FROM standard_method", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length > 0) {
                    last = rows.length - 1;
                    year_ = rows[last].year;
                    num_ = rows[last].num;
                    year = sd.format(new Date(), 'YYYY');
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
                var method_id = "FFQR-" + year + "-" + (Array(4).join('0') + num).slice(-4);
                res.render('standard/newMethod', {id:id,password:password,name:name,method_id:method_id,sid:sid,sname:sname,year:year,num:num}); 
            }
        });
        connection.release();
    });
});
router.post('/newMethod', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var sid = "" + req.body.sid;
        var sname = "" + req.body.sname;
        var year = "" + req.body.year;
        var num = "" + req.body.num;
        var method_id = "" + req.body.method_id;
        var method_name = "" + req.body.method_name;
        var one = 1;
        connection.query('UPDATE standard set methoding=? WHERE sid=?', [one,sid], function (err, rows) {
            if (err) {
                res.status(404).end();
            }      
        });
        connection.query('INSERT INTO standard_method(sid,sname,year,num,method_id,method_name,testMan) VALUES(?,?,?,?,?,?,?)', [sid,sname,year,num,method_id,method_name,cname], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/standard/method?id=" + id + "&password=" + password + "&name=" + cname + "&sid=" + sid + "';</script>");
            }      
        });    
        connection.release();
    });  
});
// 测试方法列表
router.get('/method', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var sid = "" + param.sid;
        connection.query("SELECT * FROM standard_method WHERE sid='" + sid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('standard/method', {datas:rows,id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 测试方法详情
router.get('/methodDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var method_id = "" + param.method_id;
        var duty;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 duty = rows[0].duty;
                 connection.query("SELECT * FROM standard_method WHERE method_id='" + method_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('standard/methodDetail', {datas:rows[0],id:id,password:password,name:name,duty:duty}); 
                    }
                });
            }
        }); 
        connection.release();
    });
});
// 填写测试方法确认
router.get('/writeMethod', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var method_id = "" + param.method_id;
        var datas1;
        connection.query("SELECT * FROM activity_testreport WHERE finalOpinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 datas1 = rows;
                 connection.query("SELECT * FROM standard_method WHERE method_id='" + method_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('standard/writeMethod', {datas:rows[0],datas1:datas1,id:id,password:password,name:name}); 
                    }
                });
            }
        });  
        connection.release();
    });
});
router.post('/writeMethod', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var method_id = "" + req.body.method_id;
        var background = "" + req.body.background;
        var step = "" + req.body.step;
        var testreport_id = "" + req.body.testreport_id;
        var content1 = "" + req.body.content1;
        var content2 = "" + req.body.content2;
        var content3 = "" + req.body.content3;
        var run_state = "" + req.body.run_state;
        var affair = "请确认测试方法确认";
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
                var link = '/standard/writemethodCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&method_id=' + method_id + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE standard_method set background=?,step=?,testreport_id=?,content1=?,content2=?,content3=?,run_state=? WHERE method_id=?', [background,step,testreport_id,content1,content2,content3,run_state,method_id], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/standard/methodDetail?id=" + id + "&password=" + password + "&name=" + cname + "&method_id=" + method_id + "';</script>");
                            }
                        });
                    }
                });
            }
        });     
        connection.release();
    });  
});
router.get('/writemethodCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var method_id = "" + param.method_id;
        var longTime = "" + param.longTime;
        var datas1;
        connection.query("SELECT * FROM activity_testreport WHERE finalOpinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 datas1 = rows;
                 connection.query("SELECT * FROM standard_method WHERE method_id='" + method_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('standard/writemethodCheck', {datas1:datas1,datas:rows[0],id:id,password:password,name:name,longTime:longTime}); 
                    }
                });
            }
        });
        connection.release();
    });
});
router.post('/writemethodCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var method_id = "" + req.body.method_id;
        var sid = "" + req.body.sid;
        var longTime = "" + req.body.longTime;
        var run_state = "" + req.body.run_state;
        var opinion = "" + req.body.opinion;
        var time = sd.format(new Date(), 'YYYY-MM-DD');
        var one = 1;
        var zero = 0;
        if (run_state == "是") {
            opinion = "同意";
        }
        if (opinion == "作废此标准") {
            var state = "已作废";
            connection.query('UPDATE standard set state=?,ismethod=?,methoding=?,last_update_time=? WHERE sid=?', [state,one,zero,time,sid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }      
            });
        }
        if (opinion == "同意") {
            var state = "正常使用";
            connection.query('UPDATE standard set state=?,ismethod=?,methoding=?,last_update_time=? WHERE sid=?', [state,one,zero,time,sid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }      
            });
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE standard_method set techName=?,opinion=? WHERE method_id=?', [cname,opinion,method_id], function (err, rows) {
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
router.get('/testmethod', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var method_id = "" + param.method_id;
        var datas1;
        connection.query("SELECT * FROM activity_testreport WHERE finalOpinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 datas1 = rows;
                 connection.query("SELECT * FROM standard_method WHERE method_id='" + method_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('standard/testmethod', {datas1:datas1,datas:rows[0],id:id,password:password,name:name}); 
                    }
                });
            }
        });
        connection.release();
    });
});
// 已作废标准
router.get('/cancel', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM standard WHERE state='已作废'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('standard/cancel', {datas:rows,id:id,password:password,name:name}); 
            }
        });
        connection.release();
    });
});
module.exports = router;