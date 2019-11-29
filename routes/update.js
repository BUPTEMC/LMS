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
        var isupdate;
        connection.query("SELECT * FROM standard_update WHERE state='等待变更确认'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows.length == 0) {
                    isupdate = 1;
                }
                else {
                    isupdate = 0;
                }
                connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                         duty = rows[0].duty;
                         connection.query("SELECT * FROM standard_update order by serialNumber desc", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.render('update/update', {datas:rows,id:id,password:password,name:name,duty:duty,isupdate:isupdate}); 
                            }
                        });
                    }
                });  
            }
        });
        connection.release();
    });
});
// 新建标准查新
router.get('/newUpdate', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM standard WHERE state='正常使用'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('update/newUpdate', {datas:rows,id:id,password:password,name:name});  
            }
        });
        connection.release();
    });
});
router.get('/clearupdate', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT update_name FROM standard_update WHERE update_name='" + name + "'", function (err, rows) {
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
router.post('/newUpdate', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var update_name = "" + req.body.update_name;
        var date = "" + req.body.date;
        var recorder = "" + req.body.recorder;
        var result = "" + req.body.result;
        var standard = "" + req.body.standard;
        var state;
        var sid = "";
        var sname = "";
        if (result == "没有文件进行了更新") {
            state = "查新完成";
        }
        else {
            state = "等待变更确认";
            var _standard = standard.split(",");
            var last = _standard.length - 1;
            var info;
            var state_ = "待填写";
            for (var i = 0; i < _standard.length; i++) {
                (function(i) {
                    info = _standard[i].split("|");
                    connection.query('INSERT INTO standard_confirm(update_name,sid,sname,state,recorder) VALUES(?,?,?,?,?)', [update_name,info[0],info[1],state_,recorder], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }     
                    });
                })(i);
            }
            for (var i = 0; i < _standard.length - 1; i++) {
                info = _standard[i].split("|");
                sid += info[0] + ",";
                sname += info[1] + ",";
            }
            info = _standard[last].split("|");
            sid += info[0];
            sname += info[1];
             
        }
        connection.query('INSERT INTO standard_update(update_name,date,recorder,result,sid,sname,state) VALUES(?,?,?,?,?,?,?)', [update_name,date,recorder,result,sid,sname,state], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/update?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        }); 
        connection.release();
    });  
});
// 标准查新详情
router.get('/updateDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var update_name = "" + param.update_name;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                connection.query("SELECT * FROM standard_update WHERE update_name='" + update_name + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        var datas = rows[0];
                        connection.query("SELECT * FROM standard_confirm WHERE update_name='" + update_name + "'", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.render('update/updateDetail', {datas:datas,datas1:rows,id:id,password:password,name:name,duty:duty}); 
                            }
                        });
                    }
                }); 
            }
        }); 
        connection.release();
    });
});
// 标准变更详情
router.get('/confirm', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var update_name = "" + param.update_name;
        var sid = "" + param.sid;
        var sname = "" + param.sname;
        connection.query("SELECT * FROM standard_confirm WHERE update_name='" + update_name + "' AND sid='" + sid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('update/confirm', {datas:rows[0],id:id,password:password,name:name,update_name:update_name}); 
            }
        }); 
        connection.release();
    });
});
// 填写标准变更内容
router.get('/toconfirm', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var update_name = "" + param.update_name;
        var sid = "" + param.sid;
        connection.query("SELECT * FROM standard_confirm WHERE update_name='" + update_name + "' AND sid='" + sid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('update/toconfirm', {datas:rows[0],id:id,password:password,name:name});  
            }
        });
        connection.release();
    });
});
router.post('/toconfirm', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var update_name = "" + req.body.update_name;
        var sid = "" + req.body.sid;
        var new_sname = "" + req.body.new_sname;
        var new_sid = "" + req.body.new_sid;
        var content = "" + req.body.content;
        var publish_date = "" + req.body.publish_date;
        var implement_date = "" + req.body.implement_date;
        var standard_url = "" + req.body.standard_url;
        var method_needed = "" + req.body.method_needed;
        var date = sd.format(new Date(), 'YYYY-MM-DD');
        var state = "待确认";
        var affair = "请确认标准变更";
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
                var link = '/update/toconfirmCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&update_name=' + update_name + '&sid=' + sid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE standard_confirm set new_sid=?,new_sid=?,new_sname=?,content=?,publish_date=?,implement_date=?,standard_url=?,method_needed=?,date=?,longTime=?,state=? WHERE update_name=? AND sid=?', [new_sid,new_sid,new_sname,content,publish_date,implement_date,standard_url,method_needed,date,time,state,update_name,sid], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            }
                            else {
                                res.send("<script>alert('提交成功!');window.location.href = '/update/updateDetail?id=" + id + "&password=" + password + "&name=" + cname + "&update_name=" + update_name + "';</script>");
                            }      
                        });
                    }
                });
            }
        }); 
        connection.release();
    });  
});
router.get('/toconfirmCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var update_name = "" + param.update_name;
        var sid = "" + param.sid;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM standard_confirm WHERE update_name='" + update_name + "' AND sid='" + sid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('update/toconfirmCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime});  
            }
        });
        connection.release();
    });
});
router.post('/toconfirmCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var update_name = "" + req.body.update_name;
        var sid = "" + req.body.sid;
        var longTime = "" + req.body.longTime;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var time = sd.format(new Date(), 'YYYY-MM-DD');
        var one = 1;
        var zero = 0;
        var state,datas,type;
        if (opinion == "同意") {
            state = "确认成功";
            connection.query("SELECT * FROM standard WHERE sid='" + sid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    type = rows[0].type;
                    connection.query("SELECT * FROM standard_confirm WHERE update_name='" + update_name + "' AND sid='" + sid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas = rows[0];
                            if (datas.method_needed == "是") {
                                state_ = "等待方法确认";
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
                                        var time_ = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                                        var link = '/standard/standardDetail?id=' + userid + '&password=' + userpassword + '&name=' + username + '&sid=' + datas.new_sid + '&longTime=' + time_;
                                        connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time_,affair,link], function (err, rows) {
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
                                state_ = "正常使用";
                                var last_update_time = dateFormat(new Date(), "yyyy-mm-dd");
                            }
                            var _state = "已作废";
                            connection.query('UPDATE standard set state=?,last_update_time=? WHERE sid=?', [_state,time,sid], function (err, rows) {
                                if (err) {
                                    res.status(404).end();
                                }
                                else {
                                    connection.query('INSERT INTO standard(sid,sname,type,publish_date,implement_date,standard_url,last_update_time,state,method_needed) VALUES(?,?,?,?,?,?,?,?,?)', [datas.new_sid,datas.new_sname,type,datas.publish_date,datas.implement_date,datas.standard_url,last_update_time,state_,datas.method_needed], function (err, rows) {
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
                    });  
                }
            });
        }
        else {
            state = "待填写";
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE standard_confirm set state=?,techName=?,confirm_date=?,opinion=?,remarks=? WHERE update_name=? AND sid=?', [state,cname,time,opinion,remarks,update_name,sid], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        res.send("<script>alert('提交成功!');window.location.href = '/update/updateDetail?id=" + id + "&password=" + password + "&name=" + cname + "&update_name=" + update_name + "';</script>");
                    }      
                });
            }
        });
        connection.release();
    });  
});
// 检测是否查新完成
router.post('/updatestate', function (req, res) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var update_name = "" + param.update_name;
        var state = "查新完成";
        connection.query('UPDATE standard_update SET state=? WHERE update_name=?', [state,update_name], function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.send("success");
            }
        });
        connection.release();
    });  
});
module.exports = router;