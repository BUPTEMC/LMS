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
        res.render('client/client', {id:id,password:password,name:name});
        connection.release();
    });
});
// 客户来访登记
router.get('/visit', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var department;
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                department = rows[0].department;
                connection.query("SELECT * FROM client_visit order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('client/visit', {datas:rows,id:id,password:password,name:name,department:department});
                    }
                });
            }
        });
        connection.release();
    });
});
// 客户来访登记表
router.get('/newVisit', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        res.render('client/newVisit', {id:id,password:password,name:name});
        connection.release();
    });
});
router.post('/newVisit', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var phone = "" + req.body.phone;
        var name = "" + req.body.name;
        var organization = "" + req.body.organization;
        var purpose = "" + req.body.purpose;
        var date = "" + req.body.date;
        connection.query('INSERT INTO client_visit(name,organization,phone,purpose,date) VALUES(?,?,?,?,?)', [name,organization,phone,purpose,date], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/client/visit?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        }); 
        connection.release();
    });  
});
// 客户满意度调查
router.get('/satisfaction', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var department,isnew;
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                department = rows[0].department;
                connection.query("SELECT * FROM contract WHERE state='成功签约'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        if (rows.length == 0) {
                            isnew = 0;
                        }
                        else {
                            isnew = 1;
                        }
                        connection.query("SELECT * FROM client_satisfaction order by serialNumber desc", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.render('client/satisfaction', {datas:rows,id:id,password:password,name:name,department:department,isnew:isnew});
                            }
                        });
                    }
                });
            }
        });
        connection.release();
    });
});
// 客户来访登记表
router.get('/newSatisfaction', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var num;
        connection.query("SELECT * FROM client_satisfaction", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                num = rows.length + 1;
                var satisfactionid = "EMC-MYD-"+(Array(4).join('0') + num).slice(-4);
                connection.query("SELECT * FROM contract WHERE state='成功签约'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('client/newSatisfaction', {datas:rows,id:id,password:password,name:name,satisfactionid:satisfactionid});
                    }
                });
            }
        });
        connection.release();
    });
});
router.post('/newSatisfaction', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var satisfactionid = "" + req.body.satisfactionid;
        var conid = "" + req.body.conid;
        var conname = "" + req.body.conname;
        var servant = "" + req.body.servant;
        var master = "" + req.body.master;
        var master_agent = "" + req.body.master_agent;
        var phone = "" + req.body.phone;
        var frequency = "" + req.body.frequency;
        var effect = "" + req.body.effect;
        var quality = "" + req.body.quality;
        var attitude = "" + req.body.attitude;
        var ontime = "" + req.body.ontime;
        var remarks = "" + req.body.remarks;
        var score1,score2,score3,score4,score5;
        if (frequency == "满意") {score1 = 20;} if (frequency == "一般") {score1 = 10;} if (frequency == "不满意") {score1 = 0;}
        if (effect == "满意") {score2 = 20;} if (effect == "一般") {score2 = 10;} if (effect == "不满意") {score2 = 0;}
        if (quality == "满意") {score3 = 20;} if (quality == "一般") {score3 = 10;} if (quality == "不满意") {score3 = 0;}
        if (attitude == "满意") {score4 = 20;} if (attitude == "一般") {score4 = 10;} if (attitude == "不满意") {score4 = 0;}
        if (ontime == "满意") {score5 = 20;} if (ontime == "一般") {score5 = 10;} if (ontime == "不满意") {score5 = 0;}
        var sum = score1 + score2 + score3 + score4 + score5;
        var satisfaction = "" + sum + "%";
        connection.query('INSERT INTO client_satisfaction(satisfactionid,conid,conname,servant,master,master_agent,phone,frequency,effect,quality,attitude,ontime,satisfaction,remarks) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [satisfactionid,conid,conname,servant,master,master_agent,phone,frequency,effect,quality,attitude,ontime,satisfaction,remarks], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/client/satisfaction?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        }); 
        connection.release();
    });  
});
// 客户来访登记详情
router.get('/satisfactionDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var satisfactionid = "" + param.satisfactionid;
        connection.query("SELECT * FROM client_satisfaction WHERE satisfactionid='" + satisfactionid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('client/satisfactionDetail', {datas:rows[0],id:id,password:password,name:name});
            }
        });
        connection.release();
    });
});
// 客户来访登记详情
router.post('/getcontract', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var conid = "" + param.conid;
        connection.query("SELECT * FROM contract WHERE conid='" + conid + "'", function (err, rows) {
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
module.exports = router;