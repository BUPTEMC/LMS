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
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                connection.query("SELECT * FROM IMC order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('IMC/IMC', {datas:rows,id:id,password:password,name:name,duty:duty}); 
                    }
                });
            }
        }); 
        connection.release();
    });
});
// 新建
router.get('/newIMC', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var year_,num_,last,num,year,ym;
        ym = dateFormat(new Date(), "yyyymm");
        connection.query("SELECT * FROM IMC", function (err, rows) {
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
                var IMC_id = "QJHC-" + ym + "-" + (Array(4).join('0') + num).slice(-4);
                res.render('IMC/newIMC', {id:id,password:password,name:name,IMC_id:IMC_id,year:year,num:num}); 
            }
        });
        connection.release();
    });
});
router.post('/newIMC', function (req, res) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var IMC_id = "" + req.body.IMC_id;
        var IMC_name = "" + req.body.IMC_name;
        var year = "" + req.body.year;
        var num = "" + req.body.num;
        var date = sd.format(new Date(), 'YYYY-MM-DD');
        var state = "待填写核查计划";
        connection.query('INSERT INTO imc(IMC_id,IMC_name,year,num,applicant,date,state) VALUES(?,?,?,?,?,?,?)', [IMC_id,IMC_name,year,num,cname,date,state], function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/IMC?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }
        });
        connection.release();
    });  
});
// 详情IMC
router.get('/IMCDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                department = rows[0].department;
                connection.query("SELECT * FROM imc WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('IMC/IMCDetail', {datas:rows[0],id:id,password:password,name:name,duty:duty,department:department});
                    }
                }); 
            }
        }); 
        connection.release();
    });
});
router.get('/IMCDetailshow', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        var message_form = "message_" + id;
        var longTime = "" + param.longTime;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                department = rows[0].department;
                connection.query("SELECT * FROM imc WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('IMC/IMCDetail', {datas:rows[0],id:id,password:password,name:name,duty:duty,department:department});
                    }
                }); 
            }
        }); 
        connection.release();
    });
});
// 核查计划详情
router.get('/planDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        connection.query("SELECT * FROM IMC WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('IMC/planDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
// 核查记录详情
router.get('/recordDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        connection.query("SELECT * FROM IMC WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('IMC/recordDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
// 填写计划
router.get('/IMCplan', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        connection.query("SELECT id FROM equipment WHERE putaway='入库' AND runningState='合格'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows;
                connection.query("SELECT * FROM imc WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('IMC/IMCplan', {datas:rows[0],id:id,password:password,name:name,datas1:datas1}); 
                    }
                });  
            }
        }); 
        connection.release();
    });
});
router.post('/geteq', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var eid = "" + param.eid;
        connection.query("SELECT * FROM equipment WHERE id='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.send(rows[0]);
            }
        });
        connection.release();
    });
});
router.post('/IMCplan', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var IMC_id = "" + req.body.IMC_id;
        var eid = "" + req.body.eid;
        var check_type = "" + req.body.check_type;
        var check_method = "" + req.body.check_method;
        var plan_writer = "" + req.body.plan_writer;
        var plan_time = "" + req.body.plan_time;
        var state = "待审核核查计划";
        var affair = "请确认期间核查计划";
        var temp = "";
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
                var link = '/IMC/IMCconfirm?id=' + userid + '&password=' + userpassword + '&name=' + username + '&IMC_id=' + IMC_id + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE imc set state=?,eid=?,check_type=?,check_method=?,plan_writer=?,plan_time=?,longTime=?,techName=?,opinion=?,remarks=? WHERE IMC_id=?', [state,eid,check_type,check_method,plan_writer,plan_time,time,temp,temp,temp,IMC_id], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            }
                            else {
                                res.send("<script>alert('提交成功!');window.location.href = '/IMC/IMCDetail?id=" + id + "&password=" + password + "&name=" + cname + "&IMC_id=" + IMC_id + "';</script>");
                            }      
                        });
                    }
                });
            }
        }); 
        connection.release();
    });  
});
// 审核计划
router.get('/IMCconfirm', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var IMC_id = "" + param.IMC_id;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM IMC WHERE IMC_id='" + IMC_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('IMC/IMCconfirm', {datas:rows[0],id:id,password:password,name:name,longTime:longTime}); 
            }
        }); 
        connection.release();
    });
});
router.post('/IMCconfirm', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var IMC_id = "" + req.body.IMC_id;
        var plan_writer = "" + req.body.plan_writer;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var longTime = "" + req.body.longTime;
        var state;
        var affair = "核查计划审核结果";
        if (opinion == "同意") {
            state = "待完成核查记录";
        }
        else {
            state = "待填写核查计划";
        }
        connection.query("SELECT * FROM user WHERE userName='" + plan_writer + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                var link = '/IMC/IMCDetailshow?id=' + userid + '&password=' + userpassword + '&name=' + username + '&IMC_id=' + IMC_id + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            }
                            else {
                                connection.query('UPDATE imc set state=?,techName=?,opinion=?,remarks=? WHERE IMC_id=?', [state,cname,opinion,remarks,IMC_id], function (err, rows) {
                                    if (err) {
                                        res.status(404).end();
                                    }
                                    else {
                                        res.send("<script>alert('提交成功!');window.location.href = '/IMC/IMCDetail?id=" + id + "&password=" + password + "&name=" + cname + "&IMC_id=" + IMC_id + "';</script>");
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
module.exports = router;