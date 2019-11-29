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
                 connection.query("SELECT * FROM ncr order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('NCR/NCR', {datas:rows,id:id,password:password,name:name,duty:duty}); 
                    }
                });
            }
        }); 
        connection.release();
    });
});
// 新建不符合项
router.get('/newNCR', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var type = "" + param.type;
        var year_,num_,last,num,year;
        connection.query("SELECT * FROM ncr", function (err, rows) {
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
                var NCR_id = "BFHX-" + year + "-" + (Array(4).join('0') + num).slice(-4);
                res.render('NCR/newNCR', {id:id,password:password,name:name,NCR_id:NCR_id,type:type,year:year,num:num}); 
            }
        });
        connection.release();
    });
});
router.post('/newNCR', function (req, res) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var NCR_id = "" + req.body.NCR_id;
        var type = "" + req.body.type;
        var source_id = "" + req.body.source_id;
        var source = "" + req.body.source;
        var abstract = "" + req.body.abstract;
        var year = "" + req.body.year;
        var num = "" + req.body.num;
        var date = sd.format(new Date(), 'YYYY-MM-DD');
        var state = "等待填写整改计划";
        if (type == "日常活动") {
            source_id = "";
        }
        connection.query('INSERT INTO ncr(NCR_id,year,num,type,source,source_id,abstract,applicant,date,state) VALUES(?,?,?,?,?,?,?,?,?,?)', [NCR_id,year,num,type,source,source_id,abstract,cname,date,state], function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/NCR?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }
        });
        connection.release();
    });  
});
// 不符合项详情
router.get('/NCRDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('NCR/NCRDetail', {datas:rows[0],id:id,password:password,name:name,duty:duty});
                    }
                }); 
            }
        }); 
        connection.release();
    });
});
// 整改计划详情
router.get('/planDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('NCR/planDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
// 整改记录详情
router.get('/recordDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('NCR/recordDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
// 申请计划
router.get('/NCRplan', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        var duty;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                duty = rows[0].duty;
                connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('NCR/NCRplan', {datas:rows[0],id:id,password:password,name:name,duty:duty}); 
                    }
                });  
            }
        }); 
        connection.release();
    });
});
router.post('/NCRplan', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var NCR_id = "" + req.body.NCR_id;
        var plan = "" + req.body.plan;
        var plan_date = "" + req.body.plan_date;
        var verifier = "" + req.body.verifier;
        var state = "等待确认整改计划";
        var affair = "请确认整改计划";
        var temp = "";
        connection.query("SELECT * FROM user WHERE duty REGEXP '" + verifier + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                var link = '/NCR/NCRconfirm?id=' + userid + '&password=' + userpassword + '&name=' + username + '&NCR_id=' + NCR_id + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE ncr set plan=?,plan_date=?,verifier=?,state=?,longTime=?,verifier_name=?,opinion=?,remarks=?,longTime=?,verify_date=? WHERE NCR_id=?', [plan,plan_date,verifier,state,time,temp,temp,temp,temp,temp,NCR_id], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            }
                            else {
                                res.send("<script>alert('提交成功!');window.location.href = '/NCR/NCRDetail?id=" + id + "&password=" + password + "&name=" + cname + "&NCR_id=" + NCR_id + "';</script>");
                            }      
                        });
                    }
                });
            }
        }); 
        connection.release();
    });  
});
// 确认计划
router.get('/NCRconfirm', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('NCR/NCRconfirm', {datas:rows[0],id:id,password:password,name:name,longTime:longTime}); 
            }
        }); 
        connection.release();
    });
});
router.post('/NCRconfirm', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var NCR_id = "" + req.body.NCR_id;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var longTime = "" + req.body.longTime;
        var verify_date = sd.format(new Date(), 'YYYY-MM-DD');
        var state;
        if (opinion == "同意") {
            state = "等待填写整改记录";
        }
        else {
            state = "等待填写整改计划";
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE ncr set state=?,verifier_name=?,opinion=?,remarks=?,longTime=?,verify_date=? WHERE NCR_id=?', [state,cname,opinion,remarks,longTime,verify_date,NCR_id], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        res.send("<script>alert('提交成功!');window.location.href = '/NCR/NCRDetail?id=" + id + "&password=" + password + "&name=" + cname + "&NCR_id=" + NCR_id + "';</script>");
                    }      
                });
            }
        }); 
        connection.release();
    });  
});
// 填写记录
router.get('/NCRrecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var NCR_id = "" + param.NCR_id;
        connection.query("SELECT * FROM ncr WHERE NCR_id='" + NCR_id + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('NCR/NCRrecord', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();
    });
});
router.post('/NCRrecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var NCR_id = "" + req.body.NCR_id;
        var content = "" + req.body.content;
        var record_date = sd.format(new Date(), 'YYYY-MM-DD');
        var state = "完成整改";
        connection.query('UPDATE ncr set state=?,content=?,recorder=?,record_date=? WHERE NCR_id=?', [state,content,cname,record_date,NCR_id], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/NCR/NCRDetail?id=" + id + "&password=" + password + "&name=" + cname + "&NCR_id=" + NCR_id + "';</script>");
            }      
        });
        connection.release();
    });  
});
module.exports = router;