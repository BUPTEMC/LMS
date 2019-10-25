var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
var sd = require('silly-datetime');
var dateFormat = require('dateformat');
var uploadModel = require('./../model/upload-model');//上传图片model
var uploadExtension = require('./../model/upload-extension');//上传扩项申请结果model
var uploadcredit = require('./../model/upload-credit');//上传资信证明model
var uploadopinion = require('./../model/upload-opinion');//上传委托方意见凭证model
var uploadcontractorResult = require('./../model/upload-contractorResult');//上传分包协议model
var uploadcontract = require('./../model/upload-contract');//上传合同model
var uploadsampleaddress = require('./../model/upload-sampleaddress');//上传抽样地点model
var uploadenvironment = require('./../model/upload-environment');//上传样品环境监测位置示意图model
var uploadenvironmentshow = require('./../model/upload-environmentshow');//上传基站环境监测位置示意图model
var uploadtestresult = require('./../model/upload-testresult');//上传测试结果model
var uploaduncertainty = require('./../model/upload-uncertainty');//上传测量不确定度model
var uploaddivreport = require('./../model/upload-divreport');//上传测量不确定度model
var userprofile = require('./../model/upload-userprofile');//上传身份信息model
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

/* GET home page. */
router.get('/', function (req, res, next) {
      pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1,datas2,datas3;
        var message_form = "message_" + id;
        var time = dateFormat(new Date(), "yyyy-mm-dd");
        connection.query("SELECT id FROM equipment WHERE putaway='入库' AND nextadjustDate='" + time + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas3 = rows;
            }
        });
        connection.query("SELECT * FROM equipment WHERE acceptedOpinion=1", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows;
            }
        });
        connection.query("SELECT * FROM " + message_form + " WHERE see=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0){
                    connection.query(userSQL.getUserActive, function (err, rows) {
                        if (err) {
                            res.render('homePage', {datas:[]}); 
                        } 
                        else {
                            res.render('homePage', {datas1:datas1,datas2:datas2,datas3:datas3,datas:rows,id:id,password:password,name:name});
                        }
                        connection.release();
                    });
                }
                else{
                    datas1 = rows;
                    connection.query(userSQL.getUserActive, function (err, rows) {
                        if (err) {
                            res.render('homePage', {datas:[]}); 
                        } 
                        else {
                            res.render('homePage', {datas1:datas1,datas2:datas2,datas3:datas3,datas:rows,id:id,password:password,name:name});
                        }
                        connection.release();
                    });
                }
            }
        });
    });   
});
/* GET personal page. */
router.get('/personal', function (req, res, next) {
      pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query(userSQL.getUserInfo, function (err, rows) {
            if (err) {
                res.render('personal', {datas:[]}); 
            } 
            else {
                res.render('personal', {datas:rows,id:id,password:password,name:name});
            }
            connection.release();
        });
    });    
});
/* GET list page. */
router.get('/list', function (req, res, next) {
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
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getequipment, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } else {
                            res.render('equipment/list', {datas:rows,id:id,password:password,name:name});
                        }
                    });
                }
            }
        });
        connection.release();
    });    
});

// 入库与再入库
router.get('/check', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT id FROM equipment", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/check', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        });
        connection.release();   
    });    
});
router.get('/recheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var datas1;
        connection.query("SELECT * FROM equipment WHERE id='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.render('equipment/recheck', {datas:[]}); 
                        } 
                        else {
                            res.render('equipment/recheck', {datas1:datas1,datas2:rows,id:id,password:password,name:name});
                        }
                    });
                }
            }
        });
        connection.release();
    });    
});
router.post('/check', function (req, res) {
    // cookie
    var param = req.query || req.params;
    var id = "" + param.id;
    var password = "" + param.password;
    var cname = "" + param.name;
    // 表单
    var number = req.body.number;
    var name = req.body.name;
    var source = req.body.source;
    var appearance = req.body.appearance;
    var assembled = req.body.assembled;
    var startingUp = req.body.startingUp;
    var storage = req.body.storage;
    var shutdown = req.body.shutdown;
    var measure = req.body.measure;
    var newDegree = req.body.newDegree;
    var acceName = "" + req.body.acceName;
    var acceNum = "" + req.body.acceNum;
    var member = "" + req.body.member; member = member.replace(/undefined/g,"");
    var opinion = req.body.opinion;
    var date = req.body.date;
    var version = req.body.version; 
    var manufactureNum = req.body.manufactureNum;
    var manufacturer = req.body.manufacturer;
    var saveMember = "" + req.body.saveMember; saveMember = saveMember.replace(/undefined/g,"");
    var correct = req.body.correct;
    var accuracyItem = "" + req.body.accuracyItem;
    var accuracyRange = "" + req.body.accuracyRange;
    var putaway = "" + req.body.opinion; putaway = putaway.replace(/1/g,"入库"); putaway = putaway.replace(/0/g,"未入库");
    var runningState = "";
    if(correct == 0){
        runningState += "准用";
    } 
    else {
        runningState += "禁用";
    }
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.insertequipment, [number,name,source,appearance,assembled,startingUp,storage,shutdown,measure,newDegree,member,opinion,date,acceName,acceNum,version,manufactureNum,manufacturer,saveMember,correct,accuracyItem,accuracyRange,runningState,putaway], function (err, rows) {
            if (err) {
                res.status(404).end();
            } else {
            res.redirect('/homePage/list?id=' + id + '&password=' + password + '&name=' + cname);
            }
        connection.release();
        });
    });  
});
router.post('/recheck', function (req, res) {
    // cookie
    var param = req.query || req.params;
    var id = "" + param.id;
    var password = "" + param.password;
    var cname = "" + param.name;
    // 表单
    var number = req.body.number;
    var name = req.body.name;
    var source = req.body.source;
    var appearance = req.body.appearance;
    var assembled = req.body.assembled;
    var startingUp = req.body.startingUp;
    var storage = req.body.storage;
    var shutdown = req.body.shutdown;
    var measure = req.body.measure;
    var newDegree = req.body.newDegree;
    var acceName = "" + req.body.acceName;
    var acceNum = "" + req.body.acceNum;
    var member = "" + req.body.member; member = member.replace(/undefined/g,"");
    var opinion = req.body.opinion;
    var date = req.body.date;
    var version = req.body.version; 
    var manufactureNum = req.body.manufactureNum;
    var manufacturer = req.body.manufacturer;
    var saveMember = "" + req.body.saveMember; saveMember = saveMember.replace(/undefined/g,"");
    var correct = req.body.correct;
    var accuracyItem = "" + req.body.accuracyItem;
    var accuracyRange = "" + req.body.accuracyRange;
    var putaway = "" + req.body.opinion; putaway = putaway.replace(/1/g,"入库"); putaway = putaway.replace(/0/g,"未入库");
    var runningState = "";
    if(correct == 0){
        runningState += "准用";
    } 
    else {
        runningState += "禁用";
    }
    pool.getConnection(function (err, connection) {
        connection.query(userSQL.recheckequipment, [source,appearance,assembled,startingUp,storage,shutdown,measure,newDegree,member,opinion,date,acceName,acceNum,version,manufactureNum,manufacturer,saveMember,correct,accuracyItem,accuracyRange,runningState,putaway,number,name], function (err, rows) {
            if (err) {
                res.status(404).end();
            } else {
            res.redirect('/homePage/list?id=' + id + '&password=' + password + '&name=' + cname);
            }
        connection.release();
        });
    });
    
});
// 设备详情
router.get('/detail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        connection.query("SELECT * FROM equipment WHERE id='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail', {datas:rows[0],id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
// 设备出入登记
router.get('/inout', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var out_number;
        connection.query("SELECT * FROM form_inout WHERE state=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                out_number = rows.length; 
            }
        });
        connection.query("SELECT * FROM form_inout WHERE state=1 order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/inout', {out_number:out_number,datas:rows,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
// 某设备出入登记表
router.get('/dinout', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var ename = "" + param.ename;
        connection.query("SELECT * FROM form_inout WHERE state=1 AND eid='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail_inout', {datas:rows,id:id,password:password,name:name,eid:eid,ename:ename});
            }
        });
        connection.release();
    });    
});
// 某设备维修登记表
router.get('/drepair', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var ename = "" + param.ename;
        connection.query("SELECT * FROM form_repair_check WHERE eid='" + eid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail_repair', {datas:rows,id:id,password:password,name:name,eid:eid,ename:ename});
            }
        });
        connection.release();
    });    
});
// 某设备使用登记表
router.get('/duse', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var ename = "" + param.ename;
        connection.query("SELECT * FROM form_use WHERE eid='" + eid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail_use', {datas:rows,id:id,password:password,name:name,eid:eid,ename:ename});
            }
        });
        connection.release();
    });    
});
// 某设备保养登记表
router.get('/dmaintenance', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var ename = "" + param.ename;
        connection.query("SELECT * FROM form_maintenance WHERE eid='" + eid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail_maintenance', {datas:rows,id:id,password:password,name:name,eid:eid,ename:ename});
            }
        });
        connection.release();
    });    
});
// 某设备校准登记表
router.get('/dadjust', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var ename = "" + param.ename;
        connection.query("SELECT * FROM form_adjust_record WHERE eid='" + eid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/detail_adjust', {datas:rows,id:id,password:password,name:name,eid:eid,ename:ename});
            }
        });
        connection.release();
    });    
});
// 设备出库记录
router.get('/out', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query(userSQL.getUserInfo, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT * FROM contacts", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT id,name FROM equipment WHERE runningState!='禁用' AND putaway!='已报废' AND putaway='入库'", function (err, rows) {
                        if (err) {
                            res.render('equipment/out', {datas:[]}); 
                        } 
                        else {
                            res.render('equipment/out', {contacts:datas2,members:datas1,datas:rows,id:id,password:password,name:name});
                        }
                    });
                }
            }
        });
        connection.release();
    });    
});
router.get('/checkName', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT userName FROM user WHERE userName REGEXP '" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (rows.length == 0) {
                        connection.query("SELECT name FROM contacts WHERE name REGEXP '" + name + "'", function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                res.send(rows); 
                                
                            }
                        });
                    } 
                    else {
                        res.send(rows);
                    }
                }
            });    
        } 
        connection.release();   
    });    
});
router.get('/clearName', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT userName FROM user WHERE userName='" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (rows.length == 0) {
                        connection.query("SELECT name FROM contacts WHERE name='" + name + "'", function (err, rows) {
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
                    }
                    else {
                        res.send("yes");
                    }
                }
            });
        }
        connection.release();    
    });    
});
router.post('/out', function (req, res) {
    // cookie
    var param = req.query || req.params;
    var id = "" + param.id;
    var password = "" + param.password;
    var cname = "" + param.name;
    // 表单
    var eid = req.body.id;
    var ename = req.body.name;
    var getequipmentTime = req.body.getequipmentTime;
    var getequipmentReason = req.body.getequipmentReason;
    var contactsName = "" + req.body.member;
    var contactsTele = "" + req.body.telephone;
    var contactsorg = "" + req.body.organization;
    var saveMember = "";
    var putaway = "出库";
    var state = 0;
    pool.getConnection(function (err, connection) {
        // 查询设备保管人
        connection.query("SELECT saveMember FROM equipment WHERE id='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                saveMember += rows[0].saveMember; 
            }
        });
        // 如果联系人不在user表或contacts表中存储至contacts中
        connection.query("SELECT * FROM user WHERE userName='" + contactsName + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0){
                    connection.query("SELECT * FROM contacts WHERE name='" + contactsName + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            if(rows.length == 0){
                                connection.query(userSQL.insertcontacts, [contactsName,contactsTele,contactsorg], function (err, rows) {
                                    if (err) {
                                        res.status(404).end(); 
                                    } 
                                    else {
                                        connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                                            if (err) {
                                                res.status(404).end(); 
                                            } 
                                            else {
                                                connection.query(userSQL.insertform_inout, [eid,ename,getequipmentTime,getequipmentReason,contactsName,saveMember,state], function (err, rows) {
                                                    if (err) {
                                                        res.status(404).end();
                                                    } else {
                                                    res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                                    }
                                                });
                                            }
                                        }); 
                                    }
                                });
                            }
                            //在contacts表中更新信息 
                            else{
                                connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                                    if (err) {
                                        res.status(404).end(); 
                                    } 
                                    else {
                                        connection.query(userSQL.insertform_inout, [eid,ename,getequipmentTime,getequipmentReason,contactsName,saveMember,state], function (err, rows) {
                                            if (err) {
                                                res.status(404).end();
                                            } else {
                                            res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            connection.query(userSQL.insertform_inout, [eid,ename,getequipmentTime,getequipmentReason,contactsName,saveMember,state], function (err, rows) {
                                if (err) {
                                    res.status(404).end();
                                } else {
                                res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                }
                            });
                        }
                    });
                } 
            }
        });
        connection.release();
    });   
});
// 设备归还记录
router.get('/in', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1,datas2,datas3;
        connection.query("SELECT userName FROM user WHERE duty REGEXP '设备管理员|技术负责人'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT userName FROM user", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows; 
            }
        });
        connection.query("SELECT * FROM contacts", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas3 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM form_inout WHERE state=0", function (err, rows) {
                        if (err) {
                            res.render('equipment/in', {datas:[]}); 
                        } 
                        else {
                            res.render('equipment/in', {contacts:datas3,allmembers:datas2,members:datas1,datas:rows,id:id,password:password,name:name});
                        }
                    });
                }
            }
        });
        connection.release();
    });    
});
router.post('/in', function (req, res) {
    // cookie
    var param = req.query || req.params;
    var id = "" + param.id;
    var password = "" + param.password;
    var cname = "" + param.name;
    // 表单
    var eid = req.body.id;
    var ename = req.body.name;
    var returnequipmentTime = req.body.returnequipmentTime;
    var returnequipmentState = req.body.returnequipmentState;
    var checkmember = "" + req.body.checkmember; checkmember = checkmember.replace(/undefined/g,"");
    var contactsName = "" + req.body.member;
    var contactsTele = "" + req.body.telephone;
    var contactsorg = "" + req.body.organization;
    var remarks = req.body.remarks;
    var putaway = "入库";
    var state = 1;
    var _state = 0;
    var runningState = "禁用";
    var breakdown = 1;
    var zero = 0;
    pool.getConnection(function (err, connection) {
        if(returnequipmentState == "出现故障"){
            connection.query('UPDATE equipment SET runningState=?,breakdown=?,correct2=?,adjust=?,adjusted=? WHERE id=? AND name=?', [runningState,breakdown,zero,zero,zero,eid,ename], function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                }
            });
        }
        connection.query("SELECT * FROM user WHERE userName='" + contactsName + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0){
                    connection.query("SELECT userName FROM user WHERE duty REGEXP '设备管理员|技术负责人'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            connection.query("SELECT * FROM contacts WHERE name='" + contactsName + "'", function (err, rows) {
                                if (err) {
                                    res.status(404).end(); 
                                } 
                                else {
                                    if(rows.length == 0){
                                        connection.query(userSQL.insertcontacts, [contactsName,contactsTele,contactsorg], function (err, rows) {
                                            if (err) {
                                                res.status(404).end(); 
                                            } 
                                            else {
                                                connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                                                    if (err) {
                                                        res.status(404).end(); 
                                                    } 
                                                    else {
                                                        connection.query(userSQL.rechecform_inout, [returnequipmentTime,returnequipmentState,checkmember,remarks,state,contactsName,eid,_state], function (err, rows) {
                                                            if (err) {
                                                                res.status(404).end();
                                                            } else {
                                                            res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                                            }
                                                        });
                                                    }
                                                }); 
                                            }
                                        });
                                    }
                                    else{
                                        connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                                            if (err) {
                                                res.status(404).end(); 
                                            } 
                                            else {
                                                connection.query(userSQL.rechecform_inout, [returnequipmentTime,returnequipmentState,checkmember,remarks,state,contactsName,eid,_state], function (err, rows) {
                                                    if (err) {
                                                        res.status(404).end();
                                                    } else {
                                                    res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                                    }
                                                });
                                            }
                                        }); 
                                    } 
                                }
                            }); 
                        }
                    }); 
                }
                else{
                    connection.query('UPDATE equipment SET putaway=? WHERE id=? AND name=?', [putaway,eid,ename], function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            connection.query(userSQL.rechecform_inout, [returnequipmentTime,returnequipmentState,checkmember,remarks,state,contactsName,eid,_state], function (err, rows) {
                                if (err) {
                                    res.status(404).end();
                                } else {
                                res.redirect('/homePage/inout?id=' + id + '&password=' + password + '&name=' + cname);
                                }
                            });
                        }
                    });  
                }
            }   
        });
        connection.release();
    });   
});
// 设备使用记录
router.get('/use', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_use order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/use', {datas:rows,id:id,password:password,name:name}); 
            }
        });
        connection.release();
    });    
});
router.get('/useCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1,datas2;
        connection.query("SELECT id,name,testProject FROM equipment WHERE runningState!='禁用' AND putaway!='已报废' AND putaway='入库'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT * FROM contacts", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/useCheck', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/useCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var useTime = req.body.useTime;
        var eid = req.body.id;
        var ename = req.body.name;
        var contactsName = "" + req.body.member;
        var contactsTele = "" + req.body.telephone;
        var contactsorg = "" + req.body.organization;
        var startTime = "" + req.body.startTime; startTime = startTime.replace(/T/g," ");
        var endTime = "" + req.body.endTime; endTime = endTime.replace(/T/g," ");
        var remarks = req.body.remarks;
        var runningState = "禁用";
        var breakdown = 1;
        var zero = 0;
        connection.query("SELECT * FROM user WHERE userName='" + contactsName + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0){
                    connection.query("SELECT * FROM contacts WHERE name='" + contactsName + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            if(rows.length == 0){
                                connection.query(userSQL.insertcontacts, [contactsName,contactsTele,contactsorg], function (err, rows) {
                                    if (err) {
                                        res.status(404).end(); 
                                    } 
                                    else {
                                        connection.query(userSQL.insertform_useCheck, [eid,ename,contactsName,startTime,endTime,remarks], function (err, rows) {
                                            if (err) {
                                                res.status(404).end();
                                            } else {
                                            res.redirect('/homePage/use?id=' + id + '&password=' + password + '&name=' + cname);
                                            }
                                        }); 
                                    }
                                });
                            }
                            //在contacts表中更新信息 
                            else{
                                connection.query(userSQL.insertform_useCheck, [eid,ename,contactsName,startTime,endTime,remarks], function (err, rows) {
                                    if (err) {
                                        res.status(404).end();
                                    } else {
                                    res.redirect('/homePage/use?id=' + id + '&password=' + password + '&name=' + cname);
                                    }
                                });
                            }
                        }
                    });
                }
                else{
                    connection.query(userSQL.insertform_useCheck, [eid,ename,contactsName,startTime,endTime,remarks], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } else {
                        res.redirect('/homePage/use?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                } 
            }
        });
        connection.release();
    });  
});
// 设备检定校准
router.get('/adjust', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT * FROM form_adjust_record order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows;
            }
        });
        connection.query("SELECT * FROM form_adjust_plan order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/adjust', {datas:rows,datas1:datas1,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
router.get('/adjustPlan', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query("SELECT * FROM equipment WHERE putaway='入库' AND isadjust_plan=0 AND correct=1 AND outage=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT name FROM adjust_content", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/adjustPlan', {datas1:datas1,datas2:datas2,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        }); 
        connection.release();   
    });    
});
router.get('/adjustplanCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var adjustplanTime = "" + param.adjustplanTime;
        var datas1;
        connection.query("SELECT * FROM form_adjust_plan WHERE eid='" + eid + "' AND adjustplanTime='" + adjustplanTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/adjustplanCheck', {datas1:datas1,adjustplanTime:adjustplanTime,id:id,password:password,name:name});
                }
            }
        });
        connection.release();   
    });    
});
router.post('/adjustPlan', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var eid = req.body.id;
        var ename = req.body.name;
        var version = req.body.eversion;
        var manufactureNumber = req.body.manufactureNumber;
        var credentialNumber = req.body.credentialNumber;
        var credentialTime = req.body.credentialTime;
        var adjustItem = "" + req.body.item;
        var adjustTime = req.body.adjustTime; 
        var period = req.body.period;
        var adjustOrganization = req.body.adjustOrganization;
        var adjustReason = req.body.adjustReason;
        var isadjust_plan = 1;
        var affair = "请确认校准计划";
        connection.query('UPDATE equipment SET isadjust_plan=? WHERE id=? AND name=?', [isadjust_plan,eid,ename], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
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
                var link = '/homePage/adjustplanCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&adjustplanTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query(userSQL.insertform_adjust_plan, [eid,ename,version,manufactureNumber,adjustItem,adjustTime,period,adjustOrganization,time,credentialNumber,credentialTime,adjustReason], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            } else {
                            res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + cname);
                            }
                        });
                    }
                });
            }
        });
        connection.release();
    });  
});
router.post('/adjustplanCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        var eid = "" + param.eid;
        var adjustplanTime = "" + param.adjustplanTime;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var isadjust_plan = 0;
        if (opinion == "不同意") {
            connection.query('UPDATE equipment SET isadjust_plan=? WHERE id=?', [isadjust_plan,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + adjustplanTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query('UPDATE form_adjust_plan SET opinion=?,opinionRemarks=? WHERE eid=? AND adjustplanTime=?', [opinion,opinionRemarks,eid,adjustplanTime], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + cname);
            }
        });
        connection.release();
    });  
});
// 设备校准记录
router.get('/adjustRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query("SELECT eid,ename,version,manufactureNumber FROM form_adjust_plan WHERE opinion='同意' AND imported=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT * FROM adjust_content", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/adjustRecord', {datas2:datas2,datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        }); 
        connection.release();   
    });    
});
// 检测是否校准到期
router.post('/updateMessage', function (req, res) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var time = dateFormat(new Date(), "yyyy-mm-dd");
        var one = 1;
        var zero = 0;
        var temp = "";
        var runningState = "禁用"
        connection.query('UPDATE equipment SET correct2=?,adjust=?,adjusted=?,isadjust_plan=?,runningState=?,beforecredentialNumber=?,nextadjustDate=? WHERE nextadjustDate=?', [one,zero,zero,zero,runningState,temp,temp,time], function (err, rows) {
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
// 上传图片
router.post('/imgUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadModel.uploadPhoto2(req,'images',function(err,fields,uploadPath){
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
// 上传扩项申请结果
router.post('/exUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadExtension.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/adjustRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var eid = req.body.id;
        var ename = req.body.name;
        var version = req.body.eversion;
        var manufactureNumber = req.body.manufactureNumber;
        var credentialNumber = req.body.credentialNumber;
        var uncertainty = "" + req.body.uncertainty;
        var adjustTime = req.body.adjustTime; 
        var adjustItem = "" + req.body.adjustItem;
        var period = req.body.period;
        var adjustOrganization = req.body.adjustOrganization;
        var changeReason = req.body.changeReason;
        var changeState = req.body.changeState;
        var realTime = req.body.realTime;
        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        var file = "" + req.body.adjustimgUrl;
        var adjustCheck = req.body.adjustcontentCheck;
        var nextTime = req.body.nextTime;
        var imported = 1;
        var opinion = "同意";
        var zero = 0;
        var one = 1;
        var correct = 1;
        // 判断校准是否合格
        var adjusted = 0;
        var runningState = "禁用";
        if (adjustCheck == "合格") {
            adjusted = 1;
            runningState = "合格";
            correct = 0;
            connection.query('UPDATE equipment SET beforecredentialNumber=?,nextadjustDate=? WHERE id=?', [credentialNumber,nextTime,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
        }
        connection.query('UPDATE equipment SET isadjust_plan=?,adjust=?,adjusted=?,correct2=?,runningState=? WHERE id=?', [zero,one,adjusted,correct,runningState,eid], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query("UPDATE form_adjust_plan SET imported=? WHERE eid=? AND opinion=? AND imported=0", [imported,eid,opinion], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query(userSQL.insertform_adjust_record, [eid,ename,version,manufactureNumber,adjustTime,period,credentialNumber,adjustItem,uncertainty,adjustCheck,adjustOrganization,changeReason,changeState,file,realTime,time], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + cname);
            }
        });
        connection.release();
    });  
});
// 校准内容
router.get('/adjustContent', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/adjustContent', {id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/adjustContent', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var name = "" + req.body.name;
        var Upper = "" + req.body.upperLimit;
        var Lower = "" + req.body.lowerLimit;
        var unit = "" + req.body.unit;
        var upperLimit, lowerLimit;
        if (Upper == "") {
            upperLimit = 0x7fffffff;
            lowerLimit = req.body.lowerLimit;
        }
        else if (Lower == "") {
            upperLimit = req.body.upperLimit;
            lowerLimit = -0x7fffffff;
        }
        else {
            upperLimit = req.body.upperLimit;
            lowerLimit = req.body.lowerLimit;
        }
        connection.query("SELECT * FROM adjust_content WHERE name='" + name + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                if (rows.length == 0) {
                    connection.query('INSERT INTO adjust_content(name,upperLimit,lowerLimit,unit) VALUES(?,?,?,?)', [name,upperLimit,lowerLimit,unit], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        }
                        else {
                            res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                }
                else {
                    connection.query('UPDATE adjust_content SET upperLimit=?,lowerLimit=?,unit=? WHERE name=?', [upperLimit,lowerLimit,unit,name], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        }
                        else {
                            res.redirect('/homePage/adjust?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                }
            }
        });
        connection.release();
    });  
});
router.get('/getadjustPlan', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var eid = "" + param.eid;
        connection.query("SELECT * FROM form_adjust_plan WHERE opinion='同意' AND imported=0 AND eid='" + eid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    res.send("no");
                }
                else {
                    res.send(rows[0]);
                }
            }
        });
        connection.release();
    });    
});
// 保养记录
router.get('/maintenance', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_maintenance order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/maintenance', {datas:rows,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
router.get('/maintenanceRecord', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT id,name FROM equipment WHERE putaway='入库'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/maintenanceRecord', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/maintenanceRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var eid = req.body.id;
        var ename = req.body.name;
        var member = "" + req.body.member;
        var maintenanceTime = req.body.time;
        var maintenanceContent = "" + req.body.content;
        var remarks = req.body.remarks;
        connection.query(userSQL.insertform_maintenance, [eid,ename,member,maintenanceTime,maintenanceContent,remarks], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                res.redirect('/homePage/maintenance?id=' + id + '&password=' + password + '&name=' + cname);
            }
        });
        connection.release();
    });  
});
// 设备维修
router.get('/repair', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT * FROM form_repair_check order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows;
            }
        });
        connection.query("SELECT * FROM form_repair_apply order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/repair', {datas:rows,datas1:datas1,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
// 维修申请
router.get('/repairApply', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT id,name FROM equipment WHERE putaway='入库' AND breakdown=1 AND repair=0 AND isrepair_apply=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT userName FROM user WHERE duty REGEXP '设备管理员'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('equipment/repairApply', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/repairApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var eid = req.body.id;
        var ename = req.body.name;
        var member = "" + req.body.member;
        var applyTime = req.body.time;
        var reason = "" + req.body.content;
        var isrepair_apply = 1;
        var affair = "请确认维修申请";
        connection.query('UPDATE equipment SET isrepair_apply=? WHERE id=? AND name=?', [isrepair_apply,eid,ename], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        // 人员为技术负责人
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
                var link = '/homePage/repairapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query(userSQL.insertform_repair_apply, [eid,ename,member,applyTime,reason,time], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            } else {
                            res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                            }
                        });
                    }
                });
            }
        });
        connection.release();
    });  
});
// 维修申请技术负责人确认
router.get('/repairapplyCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        var datas1;
        connection.query("SELECT * FROM form_repair_apply WHERE eid='" + eid + "' AND longTime='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/repairapplyCheck', {datas1:datas1,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/repairapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var message_form = "message_" + id;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var affair = "请确认维修申请";
        var isrepair_apply = 0;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        if (opinion == "不同意") {
            connection.query("UPDATE equipment SET isrepair_apply=? WHERE id=?", [isrepair_apply,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_repair_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }
        else {
            // 人员为主任
            connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    var userid = rows[0].id;
                    var dataform = "message_" + userid;
                    var userpassword = rows[0].password;
                    var username = rows[0].userName;
                    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                    var link = '/homePage/repairapplyfinalCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&longTime=' + longTime + '&sendTime=' + time;
                    connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        }
                        else {
                            connection.query("UPDATE form_repair_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                                if (err) {
                                    res.status(404).end();
                                } else {
                                res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                                }
                            });
                        }
                    });
                }
            });
        }     
        connection.release();
    });  
});
// 维修申请主任确认
router.get('/repairapplyfinalCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        var sendTime = "" + param.sendTime;
        var datas1;
        connection.query("SELECT * FROM form_repair_apply WHERE eid='" + eid + "' AND longTime='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/repairapplyfinalCheck', {datas1:datas1,sendTime:sendTime,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/repairapplyfinalCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var message_form = "message_" + id;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        var sendTime = "" + param.sendTime;
        // 表单
        var finalOpinion = req.body.finalOpinion;
        var finalopinionRemarks = req.body.finalopinionRemarks;
        var repair = 1;
        var isrepair_apply = 0;
        // 看到自己的消息
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + sendTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        if (finalOpinion == "不同意") {
            connection.query("UPDATE equipment SET isrepair_apply=? WHERE id=?", [isrepair_apply,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_repair_apply SET finalOpinion=?,finalopinionRemarks=? WHERE eid=? AND longTime=?", [finalOpinion,finalopinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }
        else {
            connection.query("UPDATE equipment SET repair=? WHERE id=?", [repair,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_repair_apply SET finalOpinion=?,finalopinionRemarks=? WHERE eid=? AND longTime=?", [finalOpinion,finalopinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }     
        connection.release();
    });  
});
// 维修验收登记
router.get('/repairCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1;
        connection.query("SELECT * FROM form_repair_apply WHERE finalOpinion='同意' AND imported=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/repairCheck', {datas1:datas1,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/repairCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var eid = req.body.id;
        var ename = req.body.name;
        var member = "" + req.body.member;
        var leaveTime = req.body.leaveTime;
        var returnTime = "" + req.body.returnTime;
        var reason = req.body.reason;
        var checkResult = req.body.checkResult;
        var checkMember = req.body.checkMember;
        var zero = 0;
        var one = 1;
        var finalOpinion = "同意";
        var runningState = "禁用";
        if (checkResult == "合格") {
            connection.query("UPDATE equipment SET breakdown=?,repair=?,isrepair_apply=?,runningState=?,correct2=? WHERE id=?", [zero,zero,zero,runningState,one,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_repair_apply SET imported=? WHERE eid=? AND finalOpinion=? AND imported=?", [one,eid,finalOpinion,zero], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query(userSQL.insertform_repair_check, [eid,ename,member,leaveTime,returnTime,reason,checkResult,checkMember], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }
        else {
            connection.query("UPDATE equipment SET repair=?,isrepair_apply=? WHERE id=?", [zero,zero,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_repair_apply SET imported=? WHERE eid=? AND finalOpinion=? AND imported=?", [one,eid,finalOpinion,zero], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query(userSQL.insertform_repair_check, [eid,ename,member,leaveTime,returnTime,reason,checkResult,checkMember], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    res.redirect('/homePage/repair?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }
        connection.release();
    });  
});
// 设备报废
router.get('/equipmentDisabled', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_disabled_apply order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/disabled', {datas:rows,id:id,password:password,name:name}); 
            }
        });
        connection.release();
    });    
});
router.get('/equipmentdisabledCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query("SELECT id,name,version,manufactureNum,manufacturer FROM equipment WHERE putaway='入库'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/disabledCheck', {datas1:datas1,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/equipmentdisabledCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var message_form = "message_" + id;
        // 表单
        var eid = req.body.id;
        var ename = req.body.ename;
        var eversion = req.body.eversion;
        var manufactureNumber = req.body.manufactureNumber;
        var manufacturer = req.body.manufacturer;
        var price = req.body.price;
        var disabledReason = req.body.disabledReason;
        var affair = "请确认报废申请";
        connection.query("SELECT * FROM user WHERE duty REGEXP '综合管理部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                var link = '/homePage/equipmentdisabledcheckVerify?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query("INSERT INTO form_disabled_apply(eid,ename,eversion,manufactureNumber,manufacturer,price,disabledReason,longTime) VALUES(?,?,?,?,?,?,?,?)", [eid,ename,eversion,manufactureNumber,manufacturer,price,disabledReason,time], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            } else {
                            res.redirect('/homePage/equipmentDisabled?id=' + id + '&password=' + password + '&name=' + cname);
                            }
                        });
                    }
                });
            }
        });     
        connection.release();
    });  
});
router.get('/equipmentdisabledcheckVerify', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("综合管理部主管") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM form_disabled_apply WHERE eid='" + eid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('equipment/disabledcheckVerify', {datas:rows[0],id:id,password:password,name:name});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/equipmentdisabledcheckVerify', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var eid = "" + param.eid; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var putaway = "已报废";
        var runningState = "";
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE equipment SET putaway=?,runningState=?,disabledTime=? WHERE id=?", [putaway,runningState,longTime,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query("UPDATE form_disabled_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } else {
                        res.redirect('/homePage/equipmentDisabled?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                }
            });
        }
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_disabled_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/equipmentDisabled?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }    
        connection.release();
    });  
});
// 设备停用
router.get('/outage', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_outage_apply order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/outage', {datas:rows,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
router.get('/outageApply', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query("SELECT id,name,version,manufactureNum,manufacturer FROM equipment WHERE runningState!='禁用' AND putaway!='已报废' AND putaway='入库'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/outageApply', {datas1:datas1,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/outageApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var message_form = "message_" + id;
        // 表单
        var eid = req.body.id;
        var ename = req.body.ename;
        var eversion = req.body.eversion;
        var manufactureNumber = req.body.manufactureNumber;
        var manufacturer = req.body.manufacturer;
        var outageReason = req.body.outageReason;
        var affair = "请确认停用申请";
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
                var link = '/homePage/outageapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query("INSERT INTO form_outage_apply(eid,ename,eversion,manufactureNumber,manufacturer,outageReason,longTime) VALUES(?,?,?,?,?,?,?)", [eid,ename,eversion,manufactureNumber,manufacturer,outageReason,time], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            } else {
                            res.redirect('/homePage/outage?id=' + id + '&password=' + password + '&name=' + cname);
                            }
                        });
                    }
                });
            }
        });     
        connection.release();
    });  
});
router.get('/outageapplyCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM form_outage_apply WHERE eid='" + eid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('equipment/outageapplyCheck', {datas:rows[0],id:id,password:password,name:name});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/outageapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var eid = "" + param.eid; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var runningState = "禁用";
        var one = 1;
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE equipment SET runningState=?,outage=?,outageTime=? WHERE id=?", [runningState,one,longTime,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query("UPDATE form_outage_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } else {
                        res.redirect('/homePage/outage?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                }
            });
        }
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_outage_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/outage?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }    
        connection.release();
    });  
});
// 设备恢复停用
router.get('/restoreOutage', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_restoreoutage_apply order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('equipment/restoreOutage', {datas:rows,id:id,password:password,name:name});
            }
        });
        connection.release();
    });    
});
router.get('/restoreoutageApply', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1, datas2;
        connection.query("SELECT id,name,version,manufacturer,outageTime FROM equipment WHERE runningState='禁用' AND putaway!='已报废' AND putaway='入库' AND outage=1", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("设备管理员") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    res.render('equipment/restoreoutageApply', {datas1:datas1,id:id,password:password,name:name});
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/restoreoutageApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var message_form = "message_" + id;
        // 表单
        var eid = req.body.id;
        var ename = req.body.ename;
        var eversion = req.body.eversion;
        var manufacturer = req.body.manufacturer;
        var outageTime = req.body.outageTime;
        var restoreReason = req.body.restoreReason;
        var affair = "请确认恢复使用申请";
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
                var link = '/homePage/restoreoutageapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&eid=' + eid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query("INSERT INTO form_restoreoutage_apply(eid,ename,eversion,manufacturer,outageTime,restoreReason,longTime) VALUES(?,?,?,?,?,?,?)", [eid,ename,eversion,manufacturer,outageTime,restoreReason,time], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            } else {
                            res.redirect('/homePage/restoreoutage?id=' + id + '&password=' + password + '&name=' + cname);
                            }
                        });
                    }
                });
            }
        });     
        connection.release();
    });  
});
router.get('/restoreoutageapplyCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var eid = "" + param.eid;
        var longTime = "" + param.longTime;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM form_restoreoutage_apply WHERE eid='" + eid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('equipment/restoreoutageapplyCheck', {datas:rows[0],id:id,password:password,name:name});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/restoreoutageapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var eid = "" + param.eid; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var runningState = "合格";
        var zero = 0;
        var outageTime = "";
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE equipment SET runningState=?,outage=?,outageTime=? WHERE id=?", [runningState,zero,outageTime,eid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query("UPDATE form_restoreoutage_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } else {
                        res.redirect('/homePage/restoreoutage?id=' + id + '&password=' + password + '&name=' + cname);
                        }
                    });
                }
            });
        }
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("UPDATE form_restoreoutage_apply SET opinion=?,opinionRemarks=? WHERE eid=? AND longTime=?", [opinion,opinionRemarks,eid,longTime], function (err, rows) {
                if (err) {
                    res.status(404).end();
                } else {
                res.redirect('/homePage/restoreoutage?id=' + id + '&password=' + password + '&name=' + cname);
                }
            });
        }    
        connection.release();
    });  
});
// 项目详情
router.get('/testProject', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject WHERE finalOpinion='同意' AND state!='已停止' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/project', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 某项目详情
router.get('/testprojectDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        var flag,extensionApply,modify;
        connection.query("SELECT * FROM testproject_extension WHERE name='" + pname + "' AND extensioning=1 AND opinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows.length == 0 ) {
                    flag = 0;
                }
                else {
                    flag = 1;
                }
            }
        });
        connection.query("SELECT * FROM testproject_extension WHERE name='" + pname + "' AND extensioning=1", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows.length == 0 ) {
                    extensionApply = 0;
                }
                else {
                    extensionApply = 1;
                }
            }
        });
        connection.query("SELECT * FROM testproject_modify WHERE name='" + pname + "' AND modifying=1", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows.length == 0 ) {
                    modify = 0;
                }
                else {
                    modify = 1;
                }
            }
        });
        connection.query("SELECT * FROM testproject WHERE name='" + pname + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectDetail', {datas:rows[0],flag:flag,modify:modify,extensionApply:extensionApply,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 某项目评审记录
router.get('/projectdetailReview', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        connection.query("SELECT * FROM testproject_review WHERE name='" + pname + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectdetail_review', {datas:rows,id:id,password:password,name:name,pname:pname});
            }
        });
        connection.release();
    });    
});
// 某项目扩项申请记录
router.get('/projectdetailExtension', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        connection.query("SELECT * FROM testproject_extension WHERE name='" + pname + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectdetail_extension', {datas:rows,id:id,password:password,name:name,pname:pname});
            }
        });
        connection.release();
    });    
});
// 某项目调整记录
router.get('/projectdetailModify', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        connection.query("SELECT * FROM testproject_modify WHERE name='" + pname + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectdetail_modify', {datas:rows,id:id,password:password,name:name,pname:pname});
            }
        });
        connection.release();
    });    
});
// 立项申请
router.get('/testprojectapplyShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectapplyShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testprojectApply', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1,datas2,datas;
        connection.query("SELECT id,name FROM equipment WHERE putaway='入库'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT * FROM default_testprojectapply", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas2 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试员") == -1){
                    res.send("<script>alert('仅测试员有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('testproject/projectApply', {datas1:datas1,datas2:datas2,datas:rows,id:id,password:password,name:name});
                        }   
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.get('/clearproject', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT * FROM testproject WHERE name='" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (rows.length == 0) {
                        res.send("no");
                    }
                    else if (rows[0].finalOpinion == "不同意") {
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
router.post('/testprojectApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        // 表单
        var name = req.body.name;
        var criterion = req.body.criterion;
        var goal = req.body.goal;
        var demand = req.body.demand;
        var benefit = req.body.benefit;
        var content = req.body.content;
        var conditions = "" + req.body.condition;
        var conditionContent = "" + req.body.conditionContent;
        var feasibility = req.body.feasibility;
        var ename = "" + req.body.ename; ename = ename.replace(/undefined/g,"");
        var innerMember = "" + req.body.innerMember;
        var newEquipment = "" + req.body.newEquipment; newEquipment = newEquipment.replace(/undefined/g,"");
        var newPerson = "" + req.body.newPerson; newPerson = newPerson.replace(/undefined/g,"");
        var price = req.body.price;
        var affair = "请确认新项目申请";
        var state = "未立项";
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
                var link = '/homePage/testprojectapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&pname=' + name + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('INSERT INTO testproject(name,state,applicant,criterion,goal,demand,benefit,content,conditions,conditionContent,feasibility,ename,innerMember,newEquipment,newPerson,price,longTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [name,state,cname,criterion,goal,demand,benefit,content,conditions,conditionContent,feasibility,ename,innerMember,newEquipment,newPerson,price,time], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectapplyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                            }
                        });
                    }
                });
            }
        });        
        connection.release();
    });  
});
router.get('/testprojectapplyCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var pname = "" + param.pname; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM testproject WHERE name='" + pname + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('testproject/projectapplyCheck', {datas:rows[0],id:id,password:password,name:name});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var pname = "" + param.pname; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var affair = "请确认新项目申请";
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    var userid = rows[0].id;
                    var dataform = "message_" + userid;
                    var userpassword = rows[0].password;
                    var username = rows[0].userName;
                    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                    var link = '/homePage/testprojectapplyfinalCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&pname=' + pname + '&longTime=' + longTime + '&time=' + time;
                    connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            connection.query('UPDATE testproject set techName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                } else {
                                    res.json({
                                        errCode : 1,
                                        errMsg : '提交成功'
                                    });
                                }
                            });
                        }
                    });
                }
            }); 
        } 
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query('UPDATE testproject set techName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.json({
                                errCode : 1,
                                errMsg : '提交成功'
                            });
                        }
                    });
                }
            });
        }        
        connection.release();
    });  
});
router.get('/testprojectapplyfinalCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var pname = "" + param.pname;
        var time = "" + param.time; 
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.redirect('/homePage?id=' + id + '&password=' + password + '&name=' + name);
                } 
                else{
                    connection.query("SELECT * FROM testproject WHERE name='" + pname + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('testproject/projectapplyfinalCheck', {datas:rows[0],id:id,password:password,name:name,time:time});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectapplyfinalCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var pname = "" + param.pname;
        var mtime = "" + param.time;
        var longTime = "" + param.longTime;
        var ename = "" + param.ename;
        var message_form = "message_" + id;
        var eid = ename.split(",");
        var i = 0;
        var reviewState = "未审核";
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + mtime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            for (var i = 0; i < eid.length; i++) {
                (function(i) {
                    connection.query("SELECT * FROM equipment WHERE id='" + eid[i] + "'", function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            if (rows[0].testProject == "") {
                                connection.query("UPDATE equipment SET testProject='" + pname + "' WHERE id='" + eid[i] + "'", function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    }        
                                });
                            }
                            else {
                                connection.query("UPDATE equipment SET testProject=CONCAT(testProject,'," + pname + "') WHERE id='" + eid[i] + "'", function (err, rows) {
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
            connection.query('UPDATE testproject set chairmanName=?,finalOpinion=?,finalopinionRemarks=?,assureTime=? WHERE name=? AND longTime=?', [cname,opinion,opinionRemarks,time,pname,longTime], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    res.json({
                        errCode : 1,
                        errMsg : '提交成功'
                    });
                }
            });       
        } 
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + mtime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query('UPDATE testproject set chairmanName=?,finalOpinion=?,finalopinionRemarks=? WHERE name=? AND longTime=?', [cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.json({
                                errCode : 1,
                                errMsg : '提交成功'
                            });
                        }
                    });
                }
            });
        }        
        connection.release();
    });  
});
// 立项评审
router.get('/testprojectreviewShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject_review order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectreviewShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testprojectReview', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var datas1,datas;
        connection.query("SELECT name,criterion FROM testproject WHERE state='未立项' AND finalOpinion='同意'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试员") == -1){
                    res.send("<script>alert('仅测试员有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT userName FROM user WHERE duty REGEXP '实验室主任|质量负责人|技术负责人|综合管理部主管|测试技术部主管'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('testproject/projectReview', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectReview', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        // 表单
        var name = req.body.name;
        var criterion = req.body.criterion;
        var member = "" + req.body.member; member = member.replace(/undefined/g,"");
        var content1 = req.body.content1; 
        var content2 = req.body.content2;
        var content3 = req.body.content3;
        var content4 = req.body.content4;
        var content5 = req.body.content5;
        var state = "已立项未获资质认可";
        var result;
        var sum = Number(content1) + Number(content2) + Number(content3) + Number(content4) + Number(content5);
        if(sum < 15) {
            result = "评审未通过";
            connection.query('INSERT INTO testproject_review(name,criterion,member,content1,content2,content3,content4,content5,sum,result) VALUES(?,?,?,?,?,?,?,?,?,?)', [name,criterion,member,content1,content2,content3,content4,content5,sum,result], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    res.send("<script>alert('总分为" + sum + "/25分,评审未通过');window.location.href = '/homePage/testprojectreviewShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                }
            });
        }
        else {
            result = "评审通过";
            connection.query('UPDATE testproject set state=? WHERE name=?', [state,name], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('INSERT INTO testproject_review(name,criterion,member,content1,content2,content3,content4,content5,sum,result) VALUES(?,?,?,?,?,?,?,?,?,?)', [name,criterion,member,content1,content2,content3,content4,content5,sum,result], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('总分为" + sum + "/25分,评审通过');window.location.href = '/homePage/testprojectreviewShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                        }
                    });
                }
            });   
        }        
        connection.release();
    });  
});
// 扩项申请
router.get('/testprojectextensionShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject_extension order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectextensionShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testprojectExtension', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        var datas1;
        connection.query("SELECT * FROM testproject WHERE name='" + pname +"' AND extensioning=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0]; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.send("<script>alert('仅技术负责人有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query(userSQL.getUserInfo, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('testproject/projectExtension', {datas1:datas1,datas:rows,id:id,password:password,name:name});
                        }   
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectExtension', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var name = "" + param.pname; 
        // 表单
        var ename = "" + req.body.ename; ename = ename.replace(/undefined/g,"");
        var member = "" + req.body.member; member = member.replace(/undefined/g,"");
        var ability = req.body.ability;
        var extensionMethod = req.body.extensionMethod;
        var affair = "请确认扩项申请";
        var one = 1;
        connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var link = '/homePage/testprojectextensionCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&pname=' + name + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE testproject set extensioning=? WHERE name=?', [one,name], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                connection.query('INSERT INTO testproject_extension(name,ename,member,ability,extensionMethod,longTime,applicant,extensioning) VALUES(?,?,?,?,?,?,?,?)', [name,ename,member,ability,extensionMethod,time,cname,one], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectextensionShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
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
router.get('/testprojectextensionCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var pname = "" + param.pname;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.send("<script>alert('仅实验室主任有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM testproject_extension WHERE name='" + pname + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('testproject/projectextensionCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectextensionCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var pname = "" + param.pname;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        var zero = 0;
        var reviewState = "未审核";
        // 表单
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query('UPDATE testproject_extension set chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectextensionShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                }
            });       
        } 
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query('UPDATE testproject_extension set extensioning=?,chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [zero,cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            connection.query('UPDATE testproject set extensioning=? WHERE name=?', [zero,pname], function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                } else {
                                    res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectextensionShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                                }
                            });
                        }
                    });
                }
            });
        }        
        connection.release();
    });  
});
// 扩项结果确认
router.get('/testprojectresultConfirm', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        var datas1;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.send("<script>alert('仅实验室主任有权访问');window.history.go(-1)</script>");
                } 
                else{ 
                    connection.query("SELECT * FROM testproject_extension WHERE name='" + pname + "' AND extensioning=1 AND opinion='同意'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('testproject/projectresultConfirm', {datas:rows[0],id:id,password:password,name:name});
                        }   
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectresultConfirm', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var name = "" + param.pname;
        // 表单      
        var extensionResult = req.body.extensionResult;
        var extensionimgUrl = "" + req.body.extensionimgUrl;
        var state = "已获得资质认可";
        var one = 1;
        var zero = 0;
        var result1 = "通过";
        var result2 = "未通过";
        if (extensionResult == "是") {
           connection.query('UPDATE testproject set extensioning=?,state=? WHERE name=?', [zero,state,name], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('UPDATE testproject_extension set extensioning=?,result=?,file=? WHERE name=? AND extensioning=?', [zero,result1,extensionimgUrl,name,one], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectextensionShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                        }
                    });
                }
            }); 
        }
        else {
            connection.query('UPDATE testproject set extensioning=? WHERE name=?', [zero,name], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('UPDATE testproject_extension set extensioning=?,result=?,file=? WHERE name=? AND extensioning=?', [zero,result2,extensionimgUrl,name,one], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectextensionShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                        }
                    });
                }
            });
        }        
        connection.release();
    });  
});
// 项目调整
router.get('/testprojectmodifyShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject_modify order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectmodifyShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testprojectModify', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.send("<script>alert('仅技术负责人有权访问');window.history.go(-1)</script>");
                } 
                else{
                    res.render('testproject/projectModify', {pname:pname,id:id,password:password,name:name});      
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectModify', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var name = "" + param.pname; 
        // 表单
        var mode = "" + req.body.mode;
        var contentAlter = "" + req.body.contentAlter;
        var reason = "" + req.body.reason;
        var affair = "请确认项目调整";
        var one = 1;
        connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var link = '/homePage/testprojectmodifyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&pname=' + name + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE testproject set modifying=? WHERE name=?', [one,name], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                connection.query('INSERT INTO testproject_modify(name,applicant,mode,contentAlter,reason,modifying,longTime) VALUES(?,?,?,?,?,?,?)', [name,cname,mode,contentAlter,reason,one,time], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectmodifyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
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
router.get('/testprojectmodifyCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var pname = "" + param.pname;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.send("<script>alert('仅实验室主任有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM testproject_modify WHERE name='" + pname + "' AND modifying=1", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('testproject/projectmodifyCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectmodifyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;  
        var pname = "" + param.pname;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        var zero = 0;
        var state1 = "部分获得资质认可";
        var state2 = "已立项未获资质认可";
        // 表单
        var mode = req.body.mode;
        var contentAlter = req.body.contentAlter;
        var opinion = req.body.opinion;
        var opinionRemarks = req.body.opinionRemarks;
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            if (mode == "扩大测试范围") {
                connection.query('UPDATE testproject set modifying=?,content=?,state=? WHERE name=?', [zero,contentAlter,state1,pname], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        connection.query('UPDATE testproject_modify set modifying=?,chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [zero,cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectmodifyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                            }
                        });
                    }
                });
            }
            else if (mode == "改变测试范围") {
                connection.query('UPDATE testproject set modifying=?,content=?,state=? WHERE name=?', [zero,contentAlter,state2,pname], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        connection.query('UPDATE testproject_modify set modifying=?,chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [zero,cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectmodifyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                            }
                        });
                    }
                });
            } 
            else {
                connection.query('UPDATE testproject set modifying=?,content=? WHERE name=?', [zero,contentAlter,pname], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        connection.query('UPDATE testproject_modify set modifying=?,chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [zero,cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectmodifyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                            }
                        });
                    }
                });
            }      
        } 
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query('UPDATE testproject set modifying=? WHERE name=?', [zero,pname], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            connection.query('UPDATE testproject_modify set modifying=?,chairmanName=?,opinion=?,opinionRemarks=? WHERE name=? AND longTime=?', [zero,cname,opinion,opinionRemarks,pname,longTime], function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                } else {
                                    res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectmodifyShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
                                }
                            });
                        }
                    });
                }
            });
        }        
        connection.release();
    });  
});
router.get('/testprojectbanShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM testproject WHERE state='已停止' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('testproject/projectbanShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testprojectBan', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var pname = "" + param.pname;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.send("<script>alert('仅实验室主任有权访问');window.history.go(-1)</script>");
                } 
                else{
                    res.render('testproject/projectBan', {pname:pname,id:id,password:password,name:name});      
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testprojectBan', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var name = "" + param.pname; 
        // 表单
        var banReason = "" + req.body.banReason;
        var state = "已停止";
        var eqname;
        connection.query("SELECT * FROM testproject WHERE name='" + name + "'", function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                eqname = rows[0].ename;
                var ename = eqname.split(",");
                for (var i = 0; i < ename.length; i++) {
                    (function(i) {
                        connection.query("SELECT * FROM equipment WHERE id='" + ename[i] + "'", function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            }
                            else {
                                var testprojecteq = rows[0].testProject;
                                var testprojectequipment = testprojecteq.split(",");
                                var str = "," + name;
                                var reg = new RegExp(str,"g");
                                var newtestProject = testprojecteq.replace(reg,"");
                                if (testprojectequipment[0] == name) {
                                    var str2 = name + ",";
                                    var reg2 = new RegExp(str2,"g");
                                    newtestProject = testprojecteq.replace(reg2,"");
                                }
                                if (testprojectequipment.length == 1) {
                                    var reg3 = new RegExp(name,"g");
                                    newtestProject = testprojecteq.replace(reg3,"");
                                }
                                connection.query('UPDATE equipment set testProject=? WHERE id=?', [newtestProject,ename[i]], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    }
                                });
                            }
                        });
                    })(i);
                }
            }        
        });
        connection.query('UPDATE testproject set state=?,banReason=? WHERE name=?', [state,banReason,name], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/testprojectbanShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
            }
        });        
        connection.release();
    });  
});
// 安全检查
router.get('/securityCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM form_security_lab order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('security/securityCheck', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/securitycheckRecord', function (req, res, next) {
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
                var duty = rows[0].duty;
                if(duty.indexOf("学生") == -1){
                    res.send("<script>alert('仅学生有权访问');window.history.go(-1)</script>");
                } 
                else{
                    res.render('security/securitycheckRecord', {datas:rows[0],id:id,password:password,name:name});      
                }
            }
        });
        connection.release();   
    });    
});
router.post('/securitycheckRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var time = sd.format(new Date(), 'YYYY-MM-DD');
        var sanitation = req.body.sanitation;
        var electricity = req.body.electricity;
        var equipment = req.body.equipment;
        var route = req.body.route;
        var sanitation_reason = req.body.sanitationReason;
        var electricity_reason = req.body.electricityReason;
        var equipment_reason = req.body.equipmentReason;
        var route_reason = req.body.routeReason;
        var remarks = req.body.remarks;
        connection.query('INSERT INTO form_security_lab(sender,time,sanitation,electricity,equipment,route,sanitation_reason,electricity_reason,equipment_reason,route_reason,remarks) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [cname,time,sanitation,electricity,equipment,route,sanitation_reason,electricity_reason,equipment_reason,route_reason,remarks], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/securityCheck?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
            }
        });        
        connection.release();
    });  
});
// 合同管理
router.get('/contract', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM contract order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/contract', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 合同详情
router.get('/contractDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        connection.query("SELECT * FROM contract WHERE conid='" + conid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/contractDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/contractApply', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var num;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试技术部主管") == -1){
                    res.send("<script>alert('仅测试技术部主管有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT serialNumber FROM contract", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            num = rows.length + 1;
                            var cid = "EMC-HT-"+(Array(4).join('0') + num).slice(-4); 
                            connection.query("SELECT name FROM testproject WHERE state='已获得资质认可'", function (err, rows) {
                                if (err) {
                                    res.status(404).end();
                                } 
                                else {
                                    res.render('contract/contractApply', {cid:cid,datas:rows,id:id,password:password,name:name});
                                }
                            });
                        }
                    });               
                }
            }
        });
        connection.release();   
    });    
});
router.get('/clearcontract', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT conname FROM contract WHERE conname='" + name + "'", function (err, rows) {
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
router.post('/contractApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var time = sd.format(new Date(), 'YYYY-MM-DD');
        var conid = req.body.conid;
        var conname = req.body.conname;
        var organization = req.body.organization;
        var contacts = req.body.contacts;
        var tele = req.body.tele;
        var email = req.body.email;
        var pname = req.body.pname;
        var content = req.body.content;
        var method = req.body.method;
        var serviceType = req.body.serviceType;
        var duty = req.body.duty;
        var psubmitDate = req.body.psubmitDate;
        var price = req.body.price;
        var state = "未评审";
        connection.query('INSERT INTO contract(conid,conname,state,applicant,applyTime,organization,contacts,tele,email,pname,content,method,serviceType,duty,psubmitDate,price) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [conid,conname,state,cname,time,organization,contacts,tele,email,pname,content,method,serviceType,duty,psubmitDate,price], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/contract?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
            }
        });        
        connection.release();
    });  
});
// 偏离权限查询
router.post('/deviationCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        var pname = "" + param.pname;
        var conid = "" + param.conid;
        var datas1,datas;
        var flag = 0;
        connection.query("SELECT deviationState FROM contract WHERE conid='" + conid +"'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0].deviationState; 
            }
        });
        var pName = pname.split(",");
        for (var i = 0; i < pName.length; i++) {
            (function(i) {
                connection.query("SELECT innerMember FROM testproject WHERE name='" + pName[i] +"' AND extensioning=0", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        datas1 = rows[0].innerMember;
                        if(datas1.indexOf(name) !== -1){
                            flag++;
                        }
                    }
                });
            })(i);
        }
        connection.query("SELECT innerMember FROM testproject WHERE name='" + pname +"' AND extensioning=0", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(flag == 0){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅对应项目测试员有权访问'
                    });
                }
                if (datas == 1) {
                    return res.json({
                        errCode : 0,
                        errMsg : '正在申请偏离'
                    });
                }
                res.json({
                    errCode : 1,
                    errMsg : '满足申请偏离条件'
                }); 
            }
        });
        connection.release();   
    });
});
// 合同偏离
router.get('/contractDeviation', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        var conname = "" + param.conname;
        res.render('contract/contractDeviation', {conid:conid,conname:conname,id:id,password:password,name:name});
        connection.release();   
    });    
});
router.get('/contractdeviationShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        connection.query("SELECT * FROM contract_deviation WHERE conid='" + conid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var conname = rows[0].conname;
                res.render('contract/contractdeviationShow', {datas:rows,id:id,password:password,name:name,conid:conid,conname:conname}); 
            }
        }); 
        connection.release();   
    });    
});
router.post('/contractDeviation', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var conid = req.body.conid;
        var conname = req.body.conname;
        var conditions = "" + req.body.condition; conditions = conditions.replace(/,/g,";");
        var detail = "" + req.body.detail;
        var affair = "请确认允许偏离申请";
        var one = 1;
        connection.query("SELECT * FROM user WHERE duty REGEXP '测试技术部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var userid = rows[0].id;
                var dataform = "message_" + userid;
                var userpassword = rows[0].password;
                var username = rows[0].userName;
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var link = '/homePage/contractdeviationCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&conid=' + conid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE contract set deviationState=? WHERE conid=?', [one,conid], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                connection.query('INSERT INTO contract_deviation(conid,conname,conditions,detail,applicant,longTime) VALUES(?,?,?,?,?,?)', [conid,conname,conditions,detail,cname,time], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/homePage/contractdeviationShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
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
router.get('/contractdeviationCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var conid = "" + param.conid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试技术部主管") == -1){
                    res.send("<script>alert('仅测试技术部主管有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM contract_deviation WHERE conid='" + conid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('contract/contractdeviationCheck', {datas:rows[0],id:id,password:password,name:name,conid:conid,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/contractdeviationCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var conid = "" + param.conid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = req.body.opinion;
        var method = "" + req.body.method;
        var opinionRemarks = "" + req.body.opinionRemarks;
        var affair = "请确认允许偏离申请";
        var zero = 0;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        if (opinion == "同意") {
            connection.query("SELECT * FROM user WHERE duty REGEXP '技术负责人'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    var userid = rows[0].id;
                    var dataform = "message_" + userid;
                    var userpassword = rows[0].password;
                    var username = rows[0].userName;
                    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                    var link = '/homePage/contractdeviationfinalCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&conid=' + conid + '&longTime2=' + time + '&longTime=' + longTime;
                    connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            connection.query('UPDATE contract_deviation set testMan=?,method=?,opinion=?,remarks=? WHERE conid=? AND longTime=?', [cname,method,opinion,opinionRemarks,conid,longTime], function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                } else {
                                    res.send("<script>alert('提交成功');window.location.href = '/homePage/contractdeviationShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
                                }
                            }); 
                        }
                    });
                }
            });     
        }
        else {
            connection.query('UPDATE contract set deviationState=? WHERE conid=?', [zero,conid], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('UPDATE contract_deviation set testMan=?,method=?,opinion=?,remarks=? WHERE conid=? AND longTime=?', [cname,method,opinion,opinionRemarks,conid,longTime], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('提交成功');window.location.href = '/homePage/contractdeviationShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
                        }
                    });
                }
            });
        }       
        connection.release();
    });  
});
router.get('/contractdeviationfinalCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var conid = "" + param.conid;
        var longTime = "" + param.longTime;
        var longTime2 = "" + param.longTime2;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.send("<script>alert('仅技术负责人有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM contract_deviation WHERE conid='" + conid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('contract/contractdeviationfinalCheck', {datas:rows[0],id:id,password:password,name:name,conid:conid,longTime:longTime,longTime2:longTime2});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/contractdeviationfinalCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var conid = "" + param.conid;
        var longTime = "" + param.longTime;
        var longTime2 = "" + param.longTime2;
        var message_form = "message_" + id;
        // 表单
        var finalOpinion = req.body.finalOpinion;
        var methodResult = "" + req.body.methodResult;
        var zero = 0;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime2 + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query('UPDATE contract set deviationState=? WHERE conid=?', [zero,conid], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                connection.query('UPDATE contract_deviation set techMan=?,finalOpinion=?,methodResult=? WHERE conid=? AND longTime=?', [cname,finalOpinion,methodResult,conid,longTime], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        res.send("<script>alert('提交成功');window.location.href = '/homePage/contractdeviationShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
                    }
                });
            }
        });       
        connection.release();
    });  
});
// 推荐新的分包方
router.get('/newSubcontractor', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        res.render('contract/newSubcontractor', {id:id,password:password,name:name}); 
    });    
});
// 保证分包方名字不重复
router.get('/clearsubcontractorName', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT * FROM contract_subcontractor WHERE name='" + name + "'", function (err, rows) {
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
// 上传资信证明
router.post('/creditUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadcredit.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/newSubcontractor', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var name = req.body.name;
        var address = "" + req.body.address;
        var contacts = req.body.contacts;
        var tele = req.body.tele;
        var creditUrl = req.body.creditUrl;
        connection.query('INSERT INTO contract_subcontractor(name,address,contacts,tele,creditUrl) VALUES(?,?,?,?,?)', [name,address,contacts,tele,creditUrl], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/subcontractorShow?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
            }
        });       
        connection.release();
    });  
});
router.get('/subcontractorShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM contract_subcontractor", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/subcontractorShow', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 分包方评审记录
router.get('/contractorReview', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        var pname = "" + param.pname;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试技术部主管") == -1){
                    res.send("<script>alert('仅测试技术部主管有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM contract_subcontractor", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('contract/contractorReview', {datas:rows,id:id,password:password,name:name,pname:pname,conid:conid}); 
                        }
                    });       
                }
            }
        });          
    });    
});
router.post('/contractorReview', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var conid = "" + param.conid;
        // 表单
        var contractorname = "" + req.body.contractorname;
        var projectName = "" + req.body.projectName;
        var content = "" + req.body.content;
        connection.query('INSERT INTO contract_contractor(conid,contractorname,projectName,content) VALUES(?,?,?,?)', [conid,contractorname,projectName,content], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('评审通过!');window.location.href = '/homePage/contractDetail?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
            }
        });       
        connection.release();
    });  
});
// 添加合格的委托方
router.get('/addContractor', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("综合管理部主管") == -1){
                    res.send("<script>alert('仅综合管理部主管有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM contract_contractor WHERE conid='" + conid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('contract/addContractor', {datas:rows,id:id,password:password,name:name,conid:conid}); 
                        }
                    });       
                }
            }
        });          
    });    
});
// 上传委托方意见凭证
router.post('/opinionUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadopinion.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/addContractor', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var conid = "" + param.conid;
        // 表单
        var contractorName = "" + req.body.contractorName; contractorName = contractorName.replace(/undefined/g,"");
        var opinionUrl = req.body.opinionUrl;
        var contractorname = contractorName.split(",");
        for (var i = 0; i < contractorname.length; i++) {
            (function(i) {
                connection.query("UPDATE contract_contractor SET opinion=1,opinionUrl='" + opinionUrl + "' WHERE conid='" + conid + "' AND contractorname='" + contractorname[i] + "'", function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }      
                });
            })(i);
        }
        res.send("<script>alert('提交成功!');window.location.href = '/homePage/contractDetail?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");      
        connection.release();
    });  
});
router.get('/contractorDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        connection.query("SELECT * FROM contract_contractor WHERE conid='" + conid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/contractorDetail', {datas:rows,id:id,password:password,name:name,conid:conid}); 
            }
        }); 
        connection.release();   
    });    
});
// 上传分包协议
router.post('/contractorResultUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var conid = "" + param.conid;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadcontractorResult.uploadPhoto(req,'images',function(err,fields,uploadPath){
            if(err){
                return res.json({
                    errCode : 0,
                    errMsg : '上传错误'
                });
            }
            console.log(fields);    //表单中字段信息
            console.log(uploadPath);    //上传图片的相对路径
            connection.query("UPDATE contract SET contractorResultUrl='" + uploadPath + "' WHERE conid='" + conid + "'", function (err, rows) {
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
// 评审权限查询
router.post('/contractreviewCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var conid = "" + param.conid;
        var datas1;
        connection.query("SELECT state FROM contract WHERE conid='" + conid +"'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows[0].state; 
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅技术负责人有权访问'
                    });
                }
                if(datas1 == "评审通过" || datas1 == "成功签约" ||datas1 == "已作废"){
                    return res.json({
                        errCode : 0,
                        errMsg : '项目状态不满足评审条件'
                    });
                } 
                res.json({
                    errCode : 1,
                    errMsg : '满足评审条件'
                }); 
            }
        });
        connection.release();   
    });
});
// 合同评审
router.get('/contractReview', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        var datas1;
        connection.query("SELECT userName FROM user WHERE duty REGEXP '实验室主任|技术负责人|综合管理部主管|测试技术部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas1 = rows; 
            }
        });
        connection.query("SELECT * FROM contract WHERE conid='" + conid + "' AND state!='评审通过' AND state!='成功签约' AND state!='已作废'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/contractReview', {datas1:datas1,datas:rows,id:id,password:password,name:name,conid:conid}); 
            }
        });          
    });    
});
router.post('/contractReview', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var conid = "" + param.conid;
        // 表单
        var pname = "" + req.body.pname;
        var organization = "" + req.body.organization;
        var member = "" + req.body.member;
        var content1 = req.body.content1; 
        var content2 = req.body.content2;
        var content3 = req.body.content3;
        var content4 = req.body.content4;
        var content5 = req.body.content5;
        var state;
        var sum = Number(content1) + Number(content2) + Number(content3) + Number(content4) + Number(content5);
        if(sum < 15) {
            state = "评审未通过";
            connection.query('UPDATE contract set state=? WHERE conid=?', [state,conid], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('INSERT INTO contract_review(conid,pname,organization,member,content1,content2,content3,content4,content5,sum,state) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [conid,pname,organization,member,content1,content2,content3,content4,content5,sum,state], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('总分为" + sum + "/25分,评审未通过');window.location.href = '/homePage/contractreviewShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
                        }
                    });
                }
            });            
        }
        else {
            state = "评审通过";
            connection.query('UPDATE contract set state=? WHERE conid=?', [state,conid], function (err, rows) {
                if (err) {
                    return res.json({
                        errCode : 0,
                        errMsg : '提交失败'
                    });
                } else {
                    connection.query('INSERT INTO contract_review(conid,pname,organization,member,content1,content2,content3,content4,content5,sum,state) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [conid,pname,organization,member,content1,content2,content3,content4,content5,sum,state], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('总分为" + sum + "/25分,评审通过');window.location.href = '/homePage/contractreviewShow?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "';</script>");
                        }
                    });
                }
            });   
        }        
        connection.release();
    });  
});
router.get('/contractreviewShow', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        connection.query("SELECT * FROM contract_review WHERE conid='" + conid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/contractreviewShow', {datas:rows,id:id,password:password,name:name,conid:conid}); 
            }
        });          
    });    
});
// 输入正式合同编号
router.post('/confirmconrealid',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var conid = "" + param.conid;
        var conrealid = "" + param.conrealid;
        connection.query('UPDATE contract set conrealid=? WHERE conid=?', [conrealid,conid], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '更新正式合同编号失败'
                }); 
            } 
            else {
                res.json({
                    errCode : 1,
                    errMsg : '更新正式合同编号成功'
                });  
            }
        });
        connection.release();   
    });
});
// 上传合同
router.post('/contractUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var conid = "" + param.conid;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadcontract.uploadPhoto(req,'images',function(err,fields,uploadPath){
            if(err){
                return res.json({
                    errCode : 0,
                    errMsg : '上传错误'
                });
            }
            console.log(fields);    //表单中字段信息
            console.log(uploadPath);    //上传图片的相对路径
            connection.query("UPDATE contract SET state='成功签约',contractUrl='" + uploadPath + "' WHERE conid='" + conid + "'", function (err, rows) {
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
// 综合管理部主管权限查询
router.post('/synleaderCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
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
                var duty = rows[0].duty;
                if(duty.indexOf("综合管理部主管") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅综合管理部主管有权访问'
                    });                } 
                res.json({
                    errCode : 1,
                    errMsg : '满足权限条件'
                });
            }
        });
        connection.release();   
    });
});
// 汇款详情
router.get('/accountDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        var conname = "" + param.conname;
        connection.query("SELECT * FROM contract WHERE conid='" + conid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var s = Number(rows[0].accountMoney);
                var s1 = Number(rows[0].price);
                // 金额转换(加逗号)
                if (/[^0-9\.]/.test(s))
                        return "0";
                    if (s == null || s == "")
                        return "0";
                    s = s.toString().replace(/^(\d*)$/, "$1.");
                    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
                    s = s.replace(".", ",");
                    var re = /(\d)(\d{3},)/;
                    while (re.test(s))
                        s = s.replace(re, "$1,$2");
                    s = s.replace(/,(\d\d)$/, ".$1");
                    var a = s.split(".");
                    if (a[1] == "00") {
                        s = a[0];
                    }                
                if (/[^0-9\.]/.test(s1))
                        return "0";
                    if (s1 == null || s1 == "")
                        return "0";
                    s1 = s1.toString().replace(/^(\d*)$/, "$1.");
                    s1 = (s1 + "00").replace(/(\d*\.\d\d)\d*/, "$1");
                    s1 = s1.replace(".", ",");
                    var re = /(\d)(\d{3},)/;
                    while (re.test(s1))
                        s1 = s1.replace(re, "$1,$2");
                    s1 = s1.replace(/,(\d\d)$/, ".$1");
                    var a1 = s1.split(".");
                    if (a1[1] == "00") {
                        s1 = a1[0];
                    }
                connection.query("SELECT * FROM contract_account WHERE conid='" + conid + "' order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('contract/accountDetail', {datas:rows,id:id,password:password,name:name,conid:conid,conname:conname,price:s1,accountMoney:s}); 
                    }
                });                 
            }
        }); 
        connection.release();   
    });    
});
// 到账登记
router.get('/accountRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var conid = "" + param.conid;
        var conname = "" + param.conname;
        var remitter = "" + param.remitter;
        res.render('contract/accountRecord', {id:id,password:password,name:name,conid:conid,conname:conname,remitter:remitter}); 
    });    
});
router.post('/accountRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var conid = "" + param.conid;
        // 表单
        var conid = "" + req.body.conid;
        var conname = "" + req.body.conname;
        var account = "" + req.body.account;
        var bank = "" + req.body.bank;
        var remittee = "" + req.body.remittee;
        var tele = "" + req.body.tele;
        var fax = "" + req.body.fax;
        var address = "" + req.body.address;
        var email = "" + req.body.email;
        var remitter = "" + req.body.remitter;
        var remitaccount = "" + req.body.remitaccount;
        var remitBank = "" + req.body.remitBank;
        var accountMoney = req.body.accountMoney;
        var date = "" + req.body.date;
        var sum = Number(accountMoney);
        connection.query("SELECT accountMoney FROM contract WHERE conid='" + conid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var temp = rows[0].accountMoney;
                temp = Number(temp);
                sum = temp + sum;
                connection.query('UPDATE contract set accountMoney=? WHERE conid=?', [sum,conid], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }      
                }); 
            }
        }); 
        connection.query('INSERT INTO contract_account(conid,conname,account,bank,remittee,tele,fax,address,email,remitter,remitaccount,remitBank,accountMoney,date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [conid,conname,account,bank,remittee,tele,fax,address,email,remitter,remitaccount,remitBank,accountMoney,date], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/homePage/accountDetail?id=" + id + "&password=" + password + "&name=" + cname + "&conid=" + conid + "&conname=" + conname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
router.get('/accountdeepDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var serialNumber = "" + param.serialNumber;
        connection.query("SELECT * FROM contract_account WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('contract/accountdeepDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
    });    
});
// 合同作废
router.post('/contractCancel',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var conid = "" + param.conid;
        var cancelReason = "" + param.cancelReason;
        var state = "已作废";
        connection.query('UPDATE contract set cancelReason=?,state=? WHERE conid=?', [cancelReason,state,conid], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '合同作废失败'
                }); 
            } 
            else {
                res.json({
                    errCode : 1,
                    errMsg : '合同作废成功'
                });  
            }
        });
        connection.release();   
    });
});
// 测试活动
router.get('/activity', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM activity order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/activity', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 查询是否有成功签约合同
router.post('/consuccessfulCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        connection.query("SELECT * FROM contract WHERE state='成功签约'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0){
                    return res.json({
                        errCode : 0,
                        errMsg : '没有已成功签约合同'
                    });                } 
                res.json({
                    errCode : 1,
                    errMsg : '满足条件'
                });
            }
        });
        connection.release();   
    });
});
router.get('/newActivity', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT serialNumber FROM activity", function (err, rows) {
            if (err) {
                res.status(404).end();
            } 
            else {
                num = rows.length + 1;
                var acid = "EMC-HD-"+(Array(4).join('0') + num).slice(-4);
                res.render('activity/newActivity', {acid:acid,id:id,password:password,name:name});                  
            }
        });
        connection.release();   
    });    
});
router.get('/clearactivity', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT acname FROM activity WHERE acname='" + name + "'", function (err, rows) {
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
router.post('/newActivity', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var acid = "" + req.body.acid;
        var acname = "" + req.body.acname;
        var actype = "" + req.body.actype;
        var sampleneeded = "" + req.body.sampleneeded;
        var newDate = dateFormat(new Date(), "yyyy-mm-dd");
        connection.query('INSERT INTO activity(acid,acname,newDate,actype,sampleneeded) VALUES(?,?,?,?,?)', [acid,acname,newDate,actype,sampleneeded], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/homePage/activity?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
router.get('/activityDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/activityDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 关联任务名称
router.get('/relateName', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        if (actype == "委托检测") {
            var conname = "合同名称";
            connection.query("SELECT * FROM contract WHERE state='成功签约'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    res.render('activity/relateName', {datas:rows,id:id,password:password,name:name,acid:acid,acname:acname,conname:conname}); 
                }
            });
        }
        connection.release();   
    });    
});
router.post('/relateName', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var acid = "" + req.body.acid;
        var acname = "" + req.body.acname;
        var relatedName = "" + req.body.relatedName;
        connection.query('UPDATE activity set relatedName=? WHERE acid=?', [relatedName,acid], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/homePage/activityDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid +"';</script>");
            }      
        });    
        connection.release();
    });  
});
// 抽样计划权限查询
router.post('/sampletestCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var relatedName = "" + param.relatedName;
        var sample,issample,sampleneeded;
        if(relatedName == ""){
            return res.json({
                errCode : 0,
                errMsg : '请选择关联任务'
            });                
        }
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                sample = rows[0].sample;
                sampleneeded = rows[0].sampleneeded;
                issample = rows[0].issample;
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(sampleneeded == "否"){
                    return res.json({
                        errCode : 0,
                        errMsg : '不需要做抽样计划'
                    });                
                }
                if(duty.indexOf("测试员") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅测试员有权访问'
                    });                
                } 
                if(sample == 1){
                    return res.json({
                        errCode : 0,
                        errMsg : '正在做抽样计划'
                    });                
                }
                if(issample == 1){
                    return res.json({
                        errCode : 0,
                        errMsg : '已做过抽样计划'
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
router.get('/sampleApply', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        var datas1;
        if (actype == "委托检测") {
            connection.query("SELECT userName FROM user WHERE duty REGEXP '监督员'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    datas1 = rows; 
                }
            });
            connection.query("SELECT * FROM contract WHERE conname='" + relatedName + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    res.render('activity/sampleApply', {datas1:datas1,datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname}); 
                }
            });  
        }                 
    });    
});
// 上传抽样地点
router.post('/sampleaddressUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadsampleaddress.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/sampleApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        // 表单
        var organization = req.body.organization;
        var pname = req.body.pname;
        var sampleMethod = "" + req.body.sampleMethod;
        var sampleType = "" + req.body.sampleType;
        var sensitivePot = "" + req.body.sensitivePot;
        var superviseMember = "" + req.body.superviseMember;
        var sampleaddressUrl = "" + req.body.sampleaddressUrl;
        var affair = "请确认抽样计划";
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
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var link = '/homePage/sampleapplyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&acid=' + acid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE activity set sample=? WHERE acid=?', [one,acid], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            }
                            else {
                               connection.query('INSERT INTO activity_sample_apply(acid,acname,organization,pname,sampleMethod,sampleType,sensitivePot,superviseMember,sampleaddressUrl,longTime,applicant) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [acid,acname,organization,pname,sampleMethod,sampleType,sensitivePot,superviseMember,sampleaddressUrl,time,cname], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/homePage/sampleRecord?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
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
router.get('/sampleRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM activity_sample_apply order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/sampleRecord', {datas:rows,id:id,password:password,name:name}); 
            }
        });          
    });    
});
router.get('/sampleapplyCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var acid = "" + param.acid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.send("<script>alert('仅技术负责人有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM activity_sample_apply WHERE acid='" + acid + "' AND longTime='" + longTime + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('activity/sampleapplyCheck', {datas:rows[0],id:id,password:password,name:name,acid:acid,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/sampleapplyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var acid = "" + param.acid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var opinion = "" + req.body.opinion;
        var opinionRemarks = "" + req.body.opinionRemarks;
        var zero = 0;
        var one = 1;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        if (opinion == "同意") {
            connection.query('UPDATE activity set sample=?,issample=? WHERE acid=?', [zero,one,acid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
        }
        else {
            connection.query('UPDATE activity set sample=?,issample=? WHERE acid=?', [zero,zero,acid], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
        }
        connection.query('UPDATE activity_sample_apply set techName=?,opinion=?,opinionRemarks=? WHERE acid=? AND longTime=?', [cname,opinion,opinionRemarks,acid,longTime], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/sampleRecord?id=" + id + "&password=" + password + "&name=" + cname + "';</script>");
            }
        });       
        connection.release();
    });  
});
router.get('/sampleDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var acid = "" + param.acid;
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var issample = rows[0].issample;
                if(issample == 0){
                    res.send("<script>alert('抽样计划未通过');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM activity_sample_apply WHERE acid='" + acid + "' AND opinion='同意'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('activity/sampleDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
// 技术负责人权限查询
router.post('/techleaderCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var mission,sampleneeded,issample;
        var relatedName = "" + param.relatedName;
        if(relatedName == ""){
            return res.json({
                errCode : 0,
                errMsg : '请选择关联任务'
            });                
        }
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                mission = rows[0].mission;
                sampleneeded = rows[0].sampleneeded;
                issample = rows[0].issample;
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅技术负责人有权访问'
                    });                
                }
                if (sampleneeded == "是" && issample == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成抽样计划'
                    });
                }
                if(mission == 1){
                    return res.json({
                        errCode : 0,
                        errMsg : '已完成任务单'
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
router.get('/missionRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        var datas1,datas2,pname;
        if (actype == "委托检测") {
            connection.query("SELECT userName FROM user WHERE duty REGEXP '测试员'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    datas1 = rows; 
                }
            });
            connection.query("SELECT * FROM contract WHERE conname='" + relatedName + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    pname = rows[0].pname;
                    connection.query("SELECT * FROM testproject WHERE name='" + pname + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas2 = rows[0].criterion;
                            connection.query("SELECT * FROM contract WHERE conname='" + relatedName + "'", function (err, rows) {
                                if (err) {
                                    res.status(404).end(); 
                                } 
                                else {
                                    res.render('activity/missionRecord', {datas2:datas2,datas1:datas1,datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname}); 
                                }
                            });                            
                        }
                    }); 
                }
            });  
        }                 
    });    
});
router.post('/missionRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        // 表单
        var organization = req.body.organization;
        var pname = req.body.pname;
        var criterion = "" + req.body.criterion;
        var address = "" + req.body.address;
        var sender = "" + req.body.sender;
        var date = "" + req.body.missionDate;
        var testMember = "" + req.body.testMember;
        var one = 1;
        var affair = "已发布测试活动任务";
        var member = testMember.split(",");
        for (var i = 0; i < member.length; i++) {
            (function(i) {
                connection.query("SELECT * FROM user WHERE userName='" + member[i] + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        var userid = rows[0].id;
                        var dataform = "message_" + userid;
                        var userpassword = rows[0].password;
                        var username = rows[0].userName;
                        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                        var link = '/homePage/missionDetail?id=' + userid + '&password=' + userpassword + '&name=' + username + '&acid=' + acid + '&longTime=' + time;
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
            })(i);
        }       
        connection.query('UPDATE activity set mission=? WHERE acid=?', [one,acid], function (err, rows) {
            if (err) {
                res.status(404).end();
            }
        });
        connection.query('INSERT INTO activity_mission_record(acid,acname,organization,pname,criterion,address,sender,date,testMember) VALUES(?,?,?,?,?,?,?,?,?)', [acid,acname,organization,pname,criterion,address,sender,date,testMember], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/activityDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid + "';</script>");
            }
        });        
        connection.release();
    });  
});
router.get('/missionDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var acid = "" + param.acid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        var zero = 0;
        var one = 1;
        if (longTime !== "") {      
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
        }
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var mission = rows[0].mission;
                if(mission == 0){
                    res.send("<script>alert('未完成任务单');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('activity/missionDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid});
                        }
                    });       
                }
            }
        });
        connection.release();   
    });    
});
// 样品情况登记权限查询
router.post('/objsampleCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var mission,sampleneeded,issample;
        var relatedName = "" + param.relatedName;
        if(relatedName == ""){
            return res.json({
                errCode : 0,
                errMsg : '请选择关联任务'
            });                
        }
        else {
            connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    mission = rows[0].mission;
                    sampleneeded = rows[0].sampleneeded;
                    issample = rows[0].issample;
                }
            });        
            connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "' AND testMember REGEXP '" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (sampleneeded == "是" && issample == 0) {
                        return res.json({
                            errCode : 0,
                            errMsg : '未完成抽样计划'
                        });
                    }
                    if(mission == 0) {
                        return res.json({
                            errCode : 0,
                            errMsg : '未完成任务单'
                        });                
                    }
                    if(rows.length == 0){
                        return res.json({
                            errCode : 0,
                            errMsg : '仅该活动测试员有权访问'
                        });                
                    }                                   
                    res.json({
                        errCode : 1,
                        errMsg : '满足权限条件'
                    });
                }
            });
        }                
        connection.release();   
    });
});
router.get('/objsampleRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        if (actype == "委托检测") {
            connection.query("SELECT serialNumber FROM activity_sampledetail_record", function (err, rows) {
                if (err) {
                    res.status(404).end();
                } 
                else {
                    num = rows.length + 1;
                    var ypid = "EMC-YP-"+(Array(4).join('0') + num).slice(-4); 
                    connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('activity/objsampleRecord', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname,ypid:ypid}); 
                        }
                    });
                }
            }); 
              
        }                 
    });    
});
// 上传样品环境监测位置示意图
router.post('/environmentUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadenvironment.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
// 上传基站环境监测位置示意图
router.post('/environmentshowUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadenvironmentshow.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
// 上传测量不确定度
router.post('/uncertaintyUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploaduncertainty.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
// 上传分包方报告
router.post('/divreportUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploaddivreport.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
// 上传测试结果
router.post('/testresultUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    uploadtestresult.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
// 上传人员身份信息
router.post('/userprofileUpload',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    userprofile.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/objsampleRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        // 表单
        var pname = req.body.pname;
        var ypid = "" + req.body.ypid;
        var ypname = "" + req.body.ypname;
        var testMember = "" + req.body.testMember;
        var date = "" + req.body.testDate;
        var position = "" + req.body.position;
        var type = "" + req.body.type;
        var lola = "" + req.body.lola;
        var environmentUrl = "" + req.body.environmentUrl;
        var opinion = "" + req.body.opinion;
        var opinionRemarks = "" + req.body.opinionRemarks;
        var advice = "" + req.body.advice;
        connection.query('INSERT INTO activity_sampledetail_record(acid,acname,pname,ypid,ypname,testMember,date,position,type,lola,environmentUrl,opinion,opinionRemarks,advice) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [acid,acname,pname,ypid,ypname,testMember,date,position,type,lola,environmentUrl,opinion,opinionRemarks,advice], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/objsamplerecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid + "&acname=" + acname + "';</script>");
            }
        });        
        connection.release();
    });  
});
router.get('/objsamplerecordDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        connection.query("SELECT * FROM activity_sampledetail_record WHERE acid='" + acid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/objsamplerecordDetail', {datas:rows,id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/objsamplerecorddeepDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var serialNumber = "" + param.serialNumber;
        var datas1;
        connection.query("SELECT * FROM activity_sampledetail_record WHERE serialNumber='" + serialNumber + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/objsamplerecorddeepDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
// 样品情况登记权限查询
router.post('/localesecurity',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var relatedName = "" + param.relatedName;
        var mission,sampleneeded,issample;
        if(relatedName == ""){
            return res.json({
                errCode : 0,
                errMsg : '请选择关联任务'
            });                
        }
        connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                mission = rows[0].mission;
                sampleneeded = rows[0].sampleneeded;
                issample = rows[0].issample;
            }
        });      
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if (sampleneeded == "是" && issample == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成抽样计划'
                    });
                }
                if(mission == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未完成任务单'
                    });                
                } 
                if(duty.indexOf("监督员") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅监督员有权访问'
                    });                
                }
                else {
                    res.json({
                        errCode : 1,
                        errMsg : '满足权限条件'
                    });
                }              
            }
        });        
        connection.release();   
    });
});
router.get('/localesecurityCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        if (actype == "委托检测") {
            res.render('activity/localesecurityCheck', {id:id,password:password,name:name,acid:acid,acname:acname});  
        }                 
    });    
});
router.post('/localesecurityCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        // 表单
        var date = "" + req.body.date;
        var supervisor = "" + req.body.supervisor;
        var cloth = "" + req.body.cloth;
        var clothReason = "" + req.body.clothReason;
        var badge = "" + req.body.badge;
        var badgeReason = "" + req.body.badgeReason;
        var license = "" + req.body.license;
        var licenseReason = "" + req.body.licenseReason;
        var protect = "" + req.body.protect;
        var protectReason = "" + req.body.protectReason;
        var environment = "" + req.body.environment;
        var environmentReason = "" + req.body.environmentReason;
        var overtime = "" + req.body.overtime;
        var overtimeReason = "" + req.body.overtimeReason;
        connection.query('INSERT INTO activity_localesecurity(acid,acname,date,supervisor,cloth,clothReason,badge,badgeReason,license,licenseReason,protect,protectReason,environment,environmentReason,overtime,overtimeReason) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [acid,acname,date,supervisor,cloth,clothReason,badge,badgeReason,license,licenseReason,protect,protectReason,environment,environmentReason,overtime,overtimeReason], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/localesecurityDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid + "&acname=" + acname + "';</script>");
            }
        });        
        connection.release();
    });  
});
router.get('/localesecurityDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        connection.query("SELECT * FROM activity_localesecurity WHERE acid='" + acid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/localesecurityDetail', {datas:rows,id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/localesecuritydeepDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var serialNumber = "" + param.serialNumber;
        var datas1;
        connection.query("SELECT * FROM activity_localesecurity WHERE serialNumber='" + serialNumber + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/localesecuritydeepDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
// 现场原始记录权限查询
router.post('/originrecordCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var mission,sampleneeded,issample;
        var relatedName = "" + param.relatedName;
        if(relatedName == ""){
            return res.json({
                errCode : 0,
                errMsg : '请选择关联任务'
            });                
        }
        else {
            connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    mission = rows[0].mission;
                    sampleneeded = rows[0].sampleneeded;
                    issample = rows[0].issample;
                }
            });        
            connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "' AND testMember REGEXP '" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if (sampleneeded == "是" && issample == 0) {
                        return res.json({
                            errCode : 0,
                            errMsg : '未完成抽样计划'
                        });
                    }
                    if(mission == 0) {
                        return res.json({
                            errCode : 0,
                            errMsg : '未完成任务单'
                        });                
                    }
                    if(rows.length == 0){
                        return res.json({
                            errCode : 0,
                            errMsg : '仅该活动测试员有权访问'
                        });                
                    }                                   
                    res.json({
                        errCode : 1,
                        errMsg : '满足权限条件'
                    });
                }
            });
        }                
        connection.release();   
    });
});
router.get('/originRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        var datas1,num,people1,people2;
        if (actype == "委托检测") {
            connection.query("SELECT * FROM user WHERE duty REGEXP '技术负责人|测试技术部主管'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                     people1 = rows;
                }
            });
            connection.query("SELECT * FROM user WHERE duty REGEXP '测试员'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                     people2 = rows;
                }
            });
            connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    datas1 = rows[0];
                    connection.query("SELECT serialNumber FROM activity_origin_record", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            num = rows.length + 1;
                            var originid = "EMC-YSJL-"+(Array(4).join('0') + num).slice(-4);
                            connection.query("SELECT * FROM equipment WHERE putaway='入库' AND runningState!='禁用'", function (err, rows) {
                                if (err) {
                                    res.status(404).end(); 
                                } 
                                else {
                                    res.render('activity/originRecord', {datas:rows,datas1:datas1,id:id,password:password,name:name,acid:acid,acname:acname,originid:originid,people1:people1,people2:people2}); 
                                }
                            });  
                        }
                    });
                }
            });               
        }                 
    });    
});
router.post('/originRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        // 表单
        var originid = "" + req.body.originid;
        var originname = "" + req.body.originname;
        var organization = "" + req.body.organization;
        var pname = "" + req.body.pname;
        var testDate = "" + req.body.testDate;
        var testPosition = "" + req.body.testPosition;
        var weather = "" + req.body.weather;
        var temperature = "" + req.body.temperature;
        var humidity = "" + req.body.humidity;
        var eid = "" + req.body.eid;
        var environmentshowUrl = "" + req.body.environmentshowUrl;
        var testresultUrl = "" + req.body.testresultUrl;
        var measureMan = "" + req.body.measureMan;
        var adjustMan = "" + req.body.adjustMan;
        connection.query('INSERT INTO activity_origin_record(acid,acname,originid,originname,organization,pname,testDate,testPosition,weather,temperature,humidity,eid,environmentshowUrl,testresultUrl,measureMan,adjustMan) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [acid,acname,originid,originname,organization,pname,testDate,testPosition,weather,temperature,humidity,eid,environmentshowUrl,testresultUrl,measureMan,adjustMan], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid + "&acname=" + acname + "';</script>");
            }
        });        
        connection.release();
    });  
});
router.get('/originrecordDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        connection.query("SELECT * FROM activity_origin_record WHERE acid='" + acid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/originrecordDetail', {datas:rows,id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/originrecorddeepDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var serialNumber = "" + param.serialNumber;
        connection.query("SELECT * FROM activity_origin_record WHERE serialNumber='" + serialNumber + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/originrecorddeepDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname}); 
            }
        }); 
        connection.release();   
    });    
});
// 质量监督记录权限查询
router.post('/qualitysupervisionrecordCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var originid = "" + param.originid;
        var quality;
        connection.query("SELECT * FROM activity_origin_record WHERE originid='" + originid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {                                  
                quality = rows[0].quality;
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("监督员") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅监督员有权访问'
                    });                
                }
                else if (quality == 1) {
                    return res.json({
                        errCode : 0,
                        errMsg : '已做质量监督'
                    });
                }
                else {
                    connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {                                  
                            res.json({
                                errCode : 1,
                                errMsg : '满足权限条件',
                                actype : rows[0].actype,
                                relatedName : rows[0].relatedName
                            });
                        }
                    });
                }
            }
        });                
        connection.release();   
    });
});
router.get('/qualitysupervisionRecord', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        var originid = "" + param.originid;
        var people;
        if (actype == "委托检测") {
            connection.query("SELECT * FROM user WHERE duty REGEXP '监督员'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                     people = rows;
                }
            });
            connection.query("SELECT * FROM activity_origin_record WHERE originid='" + originid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    res.render('activity/qualitysupervisionRecord', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname,originid:originid,people:people});
                }
            });               
        }                 
    });    
});
router.post('/qualitysupervisionRecord', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var originid = "" + param.originid;
        // 表单
        var date = "" + req.body.date;
        var superviseMan = "" + req.body.superviseMan;
        var address = "" + req.body.address;
        var originname = "" + req.body.originname;
        var object = "" + req.body.object;
        var standard = "" + req.body.standard;
        var c1 = "" + req.body.c1;
        var content1 = "" + req.body.content1;
        var correctRecord1 = "" + req.body.correctRecord1;
        var correctResult1 = "" + req.body.correctResult1;
        var c2 = "" + req.body.c2;
        var content2 = "" + req.body.content2;
        var correctRecord2 = "" + req.body.correctRecord2;
        var correctResult2 = "" + req.body.correctResult2;
        var c3 = "" + req.body.c3;
        var content3 = "" + req.body.content3;
        var correctRecord3 = "" + req.body.correctRecord3;
        var correctResult3 = "" + req.body.correctResult3;
        var c4 = "" + req.body.c4;
        var content4 = "" + req.body.content4;
        var correctRecord4 = "" + req.body.correctRecord4;
        var correctResult4 = "" + req.body.correctResult4;
        var c5 = "" + req.body.c5;
        var content5 = "" + req.body.content5;
        var correctRecord5 = "" + req.body.correctRecord5;
        var correctResult5 = "" + req.body.correctResult5;
        var c6 = "" + req.body.c6;
        var content6 = "" + req.body.content6;
        var correctRecord6 = "" + req.body.correctRecord6;
        var correctResult6 = "" + req.body.correctResult6;
        var one = 1;
        connection.query('UPDATE activity_origin_record SET quality=? WHERE originid=?', [one,originid], function (err, rows) {
            if (err) {
                res.status(404).end(); 
            }
        });
        connection.query('INSERT INTO activity_quality_record(acid,acname,originid,date,superviseMan,address,originname,object,standard,c1,content1,correctRecord1,correctResult1,c2,content2,correctRecord2,correctResult2,c3,content3,correctRecord3,correctResult3,c4,content4,correctRecord4,correctResult4,c5,content5,correctRecord5,correctResult5,c6,content6,correctRecord6,correctResult6) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [acid,acname,originid,date,superviseMan,address,originname,object,standard,c1,content1,correctRecord1,correctResult1,c2,content2,correctRecord2,correctResult2,c3,content3,correctRecord3,correctResult3,c4,content4,correctRecord4,correctResult4,c5,content5,correctRecord5,correctResult5,c6,content6,correctRecord6,correctResult6], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/qualitysupervisionrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid + "&acname=" + acname + "&originid=" + originid + "';</script>");
            }
        });        
        connection.release();
    });  
});
router.get('/qualitysupervisionrecordDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var originid = "" + param.originid;
        connection.query("SELECT * FROM activity_origin_record WHERE originid='" + originid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows[0].quality == 0) {
                    res.send("<script>alert('未完成质量监督记录');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + name + "&acid=" + acid + "&acname=" + acname + "';</script>");
                }
                else {
                    connection.query("SELECT * FROM activity_quality_record WHERE originid='" + originid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('activity/qualitysupervisionrecordDetail', {datas:rows[0],id:id,password:password,name:name,acid:acid,acname:acname,originid:originid}); 
                        }
                    }); 
                }
            }
        });         
        connection.release();   
    });    
});
// 质量监督记录权限查询
router.post('/testreportsCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var originid = "" + param.originid;
        var sample,isOK;
        var is_OK = 1;
        connection.query("SELECT * FROM activity_testreport WHERE originid='" + originid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                 if (rows.length == 0) {
                    isOK = 1;
                 }
                 else {
                    var temp = rows;
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[i].texting == 0) {
                            isOK = 1;
                        }
                        else if (temp[i].finalOpinion == "同意") {
                            is_OK = 0;
                        }
                        else {
                            isOK = 0;
                        }
                    }                   
                 }
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("测试员") == -1){
                    return res.json({
                        errCode : 0,
                        errMsg : '仅测试员有权访问'
                    });                
                }
                else {
                    connection.query("SELECT * FROM activity_sampledetail_record WHERE acid='" + acid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {                                  
                            sample = rows.length;
                            connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                                if (err) {
                                    res.status(404).end(); 
                                } 
                                else {
                                    if (isOK == 0) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '已填写测试报告，等待审批'
                                        });
                                    }
                                    if (is_OK == 0) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '测试报告审批通过'
                                        });
                                    }
                                    if (sample == 0) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '样品情况登记未完成'
                                        });
                                    }                                  
                                    res.json({
                                        errCode : 1,
                                        errMsg : '满足权限条件',
                                        actype : rows[0].actype,
                                        relatedName : rows[0].relatedName
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });                
        connection.release();   
    });
});
router.get('/testReport', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var actype = "" + param.actype;
        var relatedName = "" + param.relatedName;
        var originid = "" + param.originid;
        var year_,num_,last,num,year;
        var EIDs = "", sqltest = "", datas1,datas,length;
        if (actype == "委托检测") {
            connection.query("SELECT * FROM activity_origin_record WHERE originid='" + originid + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    datas = rows[0];
                    EIDs = rows[0].eid;
                    eid = EIDs.split(",");
                    if (eid.length == 1) {
                        sqltest += "SELECT * FROM equipment WHERE id='" + eid[0] + "'";
                        connection.query(sqltest, function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                datas1 = rows;
                                connection.query("SELECT * FROM activity_testreport", function (err, rows) {
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
                                        var reportid = "BUPTETEL字" + year + "第" + (Array(4).join('0') + num).slice(-4) + "号";
                                        connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "'", function (err, rows) {
                                            if (err) {
                                                res.status(404).end(); 
                                            } 
                                            else {
                                                var criterion = rows[0].criterion;
                                                connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                                                    if (err) {
                                                        res.status(404).end(); 
                                                    } 
                                                    else {
                                                        var sampleneeded = rows[0].sampleneeded
                                                        connection.query("SELECT * FROM activity_sampledetail_record WHERE acid='" + acid + "'", function (err, rows) {
                                                            if (err) {
                                                                res.status(404).end(); 
                                                            } 
                                                            else {
                                                                res.render('activity/testReport', {datas:datas,year:year,num:num,datas1:datas1,datas2:rows,id:id,password:password,name:name,acid:acid,acname:acname,originid:originid,reportid:reportid,sampleneeded:sampleneeded,criterion:criterion,EIDs:EIDs}); 
                                                            }
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
                        for (var i = 0; i < eid.length - 1; i++) {
                            sqltest += "SELECT * FROM equipment WHERE id='" + eid[i] + "' UNION ALL "; 
                        }
                        sqltest += "SELECT * FROM equipment WHERE id='" + eid[eid.length - 1] + "'";
                        connection.query(sqltest, function (err, rows) {
                            if (err) {
                                res.status(404).end(); 
                            } 
                            else {
                                datas1 = rows;
                                connection.query("SELECT * FROM activity_testreport", function (err, rows) {
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
                                        var reportid = "BUPTETEL字" + year + "第" + (Array(4).join('0') + num).slice(-4) + "号";
                                        connection.query("SELECT * FROM activity_mission_record WHERE acid='" + acid + "'", function (err, rows) {
                                            if (err) {
                                                res.status(404).end(); 
                                            } 
                                            else {
                                                var criterion = rows[0].criterion;
                                                connection.query("SELECT * FROM activity WHERE acid='" + acid + "'", function (err, rows) {
                                                    if (err) {
                                                        res.status(404).end(); 
                                                    } 
                                                    else {
                                                        var sampleneeded = rows[0].sampleneeded
                                                        connection.query("SELECT * FROM activity_sampledetail_record WHERE acid='" + acid + "'", function (err, rows) {
                                                            if (err) {
                                                                res.status(404).end(); 
                                                            } 
                                                            else {
                                                                res.render('activity/testReport', {datas:datas,year:year,num:num,datas1:datas1,datas2:rows,id:id,password:password,name:name,acid:acid,acname:acname,originid:originid,reportid:reportid,sampleneeded:sampleneeded,criterion:criterion,EIDs:EIDs}); 
                                                            }
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
                }
            });                    
                           
        }                 
    });    
});
router.post('/testReport', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var originid = "" + param.originid;
        // 表单
        var year = req.body.year;
        var nums = req.body.num;
        var num = Number(nums);
        var reportid = req.body.reportid;
        var organization = req.body.organization;
        var pname = "" + req.body.pname;
        var testDate = "" + req.body.testDate;
        var weather = "" + req.body.weather;
        var temperature = "" + req.body.temperature;
        var humidity = "" + req.body.humidity;
        var eid = "" + req.body.eid;
        var criterion = "" + req.body.criterion;
        var sampleneeded = "" + req.body.sampleneeded;
        var ypid = "" + req.body.ypid;
        var po = "" + req.body.po;
        var ty = "" + req.body.ty;
        var lo = "" + req.body.lo;
        var testresultUrl = "" + req.body.testresultUrl;
        var conclusion = "" + req.body.conclusion;
        var uncertaintyUrl = "" + req.body.uncertaintyUrl;
        var environmentshowUrl = "" + req.body.environmentshowUrl;
        var c1 = "" + req.body.c1;
        var divreportUrl = "" + req.body.divreportUrl;
        var affair = "请确认测试报告";
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
                var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                var link = '/homePage/testreportCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&reportid=' + reportid + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('INSERT INTO activity_testreport(texting,year,num,acid,acname,originid,reportid,organization,pname,testDate,weather,temperature,humidity,eid,criterion,sampleneeded,ypid,po,ty,lo,testresultUrl,conclusion,uncertaintyUrl,environmentshowUrl,c1,divreportUrl,applicant) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [one,year,num,acid,acname,originid,reportid,organization,pname,testDate,weather,temperature,humidity,eid,criterion,sampleneeded,ypid,po,ty,lo,testresultUrl,conclusion,uncertaintyUrl,environmentshowUrl,c1,divreportUrl,cname], function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("<script>alert('提交成功');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid+ "&acname=" + acname +"';</script>");
                            }
                        });                       
                    }
                });
            }
        });        
        connection.release();
    });  
});
router.get('/testreportCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var reportid = "" + param.reportid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        var EIDs = "", sqltest = "", datas1;
        connection.query("SELECT * FROM activity_testreport WHERE reportid='" + reportid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                EIDs = rows[0].eid;
                eid = EIDs.split(",");
                if (eid.length == 1) {
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[0] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas1 = rows;
                        }
                    });
                }
                else {
                    for (var i = 0; i < eid.length - 1; i++) {
                        sqltest += "SELECT * FROM equipment WHERE id='" + eid[i] + "' UNION ALL "; 
                    }
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[eid.length - 1] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas1 = rows;
                        }
                    });                         
                }                    
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("技术负责人") == -1){
                    res.send("<script>alert('仅技术负责人有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM activity_testreport WHERE reportid='" + reportid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('activity/testreportCheck', {datas1:datas1,datas:rows[0],id:id,password:password,name:name,reportid:reportid,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testreportCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var reportid = "" + param.reportid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var acid = "" + req.body.acid;
        var acname = "" + req.body.acname;
        var doc = "" + req.body.doc;
        var explanation = "" + req.body.explanation;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var zero = 0;
        var one = 1;
        var affair = "请确认测试报告";
        if (opinion == "同意") {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
            });
            connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    var userid = rows[0].id;
                    var dataform = "message_" + userid;
                    var userpassword = rows[0].password;
                    var username = rows[0].userName;
                    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
                    var link = '/homePage/testreportfinalCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&reportid=' + reportid + '&longTime=' + time;
                    connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            connection.query('UPDATE activity_testreport set doc=?,explanation=?,techName=?,opinion=?,remarks=? WHERE reportid=?', [doc,explanation,cname,opinion,remarks,reportid], function (err, rows) {
                                if (err) {
                                    return res.json({
                                        errCode : 0,
                                        errMsg : '提交失败'
                                    });
                                } else {
                                    res.send("<script>alert('提交成功');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid+ "&acname=" + acname +"';</script>");
                                }
                            });
                        }
                    });
                }
            }); 
        } 
        else {
            connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
                if (err) {
                    res.status(404).end();
                }
                else {
                    connection.query('UPDATE activity_testreport set texting=?,doc=?,explanation=?,techName=?,opinion=?,remarks=? WHERE reportid=?', [zero,doc,explanation,cname,opinion,remarks,reportid], function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        } else {
                            res.send("<script>alert('提交成功');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid+ "&acname=" + acname +"';</script>");
                        }
                    });
                }
            });
        }    
        connection.release();
    });  
});
router.get('/testreportfinalCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var reportid = "" + param.reportid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        var EIDs = "", sqltest = "", datas1;
        connection.query("SELECT * FROM activity_testreport WHERE reportid='" + reportid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                EIDs = rows[0].eid;
                eid = EIDs.split(",");
                if (eid.length == 1) {
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[0] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas1 = rows;
                        }
                    });
                }
                else {
                    for (var i = 0; i < eid.length - 1; i++) {
                        sqltest += "SELECT * FROM equipment WHERE id='" + eid[i] + "' UNION ALL "; 
                    }
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[eid.length - 1] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            datas1 = rows;
                        }
                    });                         
                }                    
            }
        });
        connection.query("SELECT duty FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                var duty = rows[0].duty;
                if(duty.indexOf("实验室主任") == -1){
                    res.send("<script>alert('仅实验室主任有权访问');window.history.go(-1)</script>");
                } 
                else{
                    connection.query("SELECT * FROM activity_testreport WHERE reportid='" + reportid + "'", function (err, rows) {
                        if (err) {
                            res.status(404).end();
                        } 
                        else {
                            res.render('activity/testreportfinalCheck', {datas1:datas1,datas:rows[0],id:id,password:password,name:name,reportid:reportid,longTime:longTime});
                        }
                    });       
                }
            }
        }); 
        connection.release();   
    });    
});
router.post('/testreportfinalCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        var reportid = "" + param.reportid;
        var longTime = "" + param.longTime;
        var message_form = "message_" + id;
        // 表单
        var acid = "" + req.body.acid;
        var acname = "" + req.body.acname;
        var doc = "" + req.body.doc;
        var explanation = "" + req.body.explanation;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var zero = 0;
        var one = 1;
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE activity_testreport set texting=?,doc=?,explanation=?,chairmanName=?,finalOpinion=?,finalRemarks=? WHERE reportid=?', [zero,doc,explanation,cname,opinion,remarks,reportid], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        res.send("<script>alert('提交成功');window.location.href = '/homePage/originrecordDetail?id=" + id + "&password=" + password + "&name=" + cname + "&acid=" + acid+ "&acname=" + acname +"';</script>");
                    }
                });
            }
        });    
        connection.release();
    });  
});
router.get('/testreportList', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var originid = "" + param.originid;
        connection.query("SELECT * FROM activity_testreport WHERE originid='" + originid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('activity/testreportList', {datas:rows,id:id,password:password,name:name,acid:acid,acname:acname,originid:originid}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/testreportDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name; 
        var acid = "" + param.acid;
        var acname = "" + param.acname;
        var reportid = "" + param.reportid;
        var EIDs = "", sqltest = "", datas1,datas;
        connection.query("SELECT * FROM activity_testreport WHERE reportid='" + reportid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                EIDs = rows[0].eid;
                eid = EIDs.split(",");
                if (eid.length == 1) {
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[0] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('activity/testreportDetail', {datas1:rows,datas:datas,id:id,password:password,name:name,reportid:reportid});
                        }
                    });
                }
                else {
                    for (var i = 0; i < eid.length - 1; i++) {
                        sqltest += "SELECT * FROM equipment WHERE id='" + eid[i] + "' UNION ALL "; 
                    }
                    sqltest += "SELECT * FROM equipment WHERE id='" + eid[eid.length - 1] + "'";
                    connection.query(sqltest, function (err, rows) {
                        if (err) {
                            res.status(404).end(); 
                        } 
                        else {
                            res.render('activity/testreportDetail', {datas1:rows,datas:datas,id:id,password:password,name:name,reportid:reportid});
                        }
                    });                         
                }                    
            }
        });
        connection.release();   
    });    
});
// 人员一览表
router.get('/memberList', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query(userSQL.getUserActive, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('member/memberList', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 人员档案登记
router.get('/memberProfile', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('member/memberProfile', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.post('/memberProfile', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        // 表单
        var gender = "" + req.body.gender;
        var birthday = "" + req.body.birthday;
        var IDnumber = "" + req.body.IDnumber;
        var politics_status = "" + req.body.politics_status;
        var marriage = "" + req.body.marriage;
        var education_background = "" + req.body.education_background;
        var major = "" + req.body.major;
        var school = "" + req.body.school;
        var graduation_date = "" + req.body.graduation_date;
        var work_date = "" + req.body.work_date;
        var domicile_place = "" + req.body.domicile_place;
        var native_place = "" + req.body.native_place;
        var address = "" + req.body.address;
        var tele = "" + req.body.tele;
        var email = "" + req.body.email;
        var content = "" + req.body.content;
        var IDcardUrl = "" + req.body.IDcardUrl;
        var certificateUrl = "" + req.body.certificateUrl;
        var diplomaUrl = "" + req.body.diplomaUrl;
        connection.query('UPDATE user set gender=?,birthday=?,IDnumber=?,politics_status=?,marriage=?,education_background=?,major=?,school=?,graduation_date=?,work_date=?,domicile_place=?,native_place=?,address=?,tele=?,email=?,content=?,IDcardUrl=?,certificateUrl=?,diplomaUrl=? WHERE id=?', [gender,birthday,IDnumber,politics_status,marriage,education_background,major,school,graduation_date,work_date,domicile_place,native_place,address,tele,email,content,IDcardUrl,certificateUrl,diplomaUrl,id], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }
        });   
        connection.release();
    });  
});
// 人员详情
router.get('/memberDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        connection.query("SELECT * FROM user WHERE id=" + uid, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('member/memberDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 抽样计划权限查询
router.post('/profileCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        if(id !== uid) {
            connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    if(id !== uid) {
                        var duty = rows[0].duty;
                        if(duty.indexOf("实验室主任") == -1 && duty.indexOf("综合管理部主管") == -1 && duty.indexOf("质量负责人") == -1){
                            return res.json({
                                errCode : 0,
                                errMsg : '不满足查看权限'
                            });
                        }
                        else {
                            res.json({
                                errCode : 1,
                                errMsg : '满足权限条件'
                            });
                        }  
                    }            
                }
            });
        }
        else {
            res.json({
                errCode : 1,
                errMsg : '满足权限条件'
            });
        }
        connection.release();   
    });
});
// 人员档案登记
router.get('/memberprofileDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        connection.query("SELECT * FROM user WHERE id=" + uid, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('member/memberprofileDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
// 例会记录
router.get('/regularMeeting', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        connection.query("SELECT * FROM regular_meeting order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('member/regularMeeting', {datas:rows,id:id,password:password,name:name}); 
            }
        }); 
        connection.release();   
    });    
});
router.get('/writeregularMeeting', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        res.render('member/writeregularMeeting', {id:id,password:password,name:name}); 
        connection.release();   
    });    
});
router.post('/checkName2', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT userName FROM user WHERE userName REGEXP '" + name + "'", function (err, rows) {
                if (err) {
                    res.status(404).end(); 
                } 
                else {
                    res.send(rows);
                }
            });
        }    
        connection.release();
    });    
});
router.get('/clearName2', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT userName FROM user WHERE userName='" + name + "'", function (err, rows) {
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
        }  
        connection.release();  
    });    
});
router.post('/writeregularMeeting', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        // 表单
        var date = "" + req.body.date;
        var host = "" + req.body.host;
        var content = "" + req.body.content;
        var recorder = "" + req.body.recorder;
        connection.query('INSERT INTO regular_meeting(date,host,content,recorder) VALUES(?,?,?,?)', [date,host,content,recorder], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/homePage/regularMeeting?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }
        });   
        connection.release();
    });  
});
// 检测人员上岗审批
router.get('/memberPost', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var pname,datas,datas2,length,serialNumber;
        var content = "",score = "";
        connection.query("SELECT * FROM user WHERE id=" + id, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                if(rows[0].pnameCheck == 1) {
                    res.send("<script>alert('正在核查上岗审批');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                }
                else if (rows[0].check_result == 1) {
                    res.send("<script>alert('已上岗');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                }
                else if (rows[0].train_id == null) {
                    res.send("<script>alert('未完成任何培训');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                }
                else {
                    var tids = rows[0].train_id;
                    var tid = tids.split(","); var last = tid.length - 1;
                    var sql1 = "",sql2 = "";
                    if (tid.length !== 1) {
                        for (var i = 0; i < tid.length - 1; i++) {
                            sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[i] + "' AND opinion='同意' UNION ALL ";
                            sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[i] + "' UNION ALL ";
                        }
                        sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[last] + "' AND opinion='同意'";
                        sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[last] + "'";
                    }
                    else {
                        sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[0] + "' AND opinion='同意'";
                        sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[0] + "'";
                    }
                    connection.query(sql1, function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            content = rows;
                        }        
                    });
                    connection.query("SELECT * FROM user_post", function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            serialNumber = rows.length + 1;
                        }        
                    });
                    connection.query(sql2, function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            datas2 = rows;
                            length = datas2.length;
                            for (var i = 0; i < datas2.length; i++) {
                                (function(i) {
                                    var targets = datas2[i].target;
                                    var scores = datas2[i].score;
                                    var target = targets.split(",");
                                    var scoress = scores.split(",");
                                    for (var j = 0; j < target.length; j++) {
                                        if (target[j] == cname) {
                                            score += scoress[j] + ",";
                                        }
                                    }
                                })(i);
                            }
                            score = score.substr(0, score.length - 1);
                            res.render('member/memberPost', {datas:datas,id:id,password:password,name:cname,pname:pname,content:content,score:score,serialNumber:serialNumber});
                        }        
                    });
                }
            }
        });
        connection.release();   
    });    
});
router.post('/memberPost', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name; 
        // 表单
        var department = "" + req.body.department;
        var duty = "" + req.body.duty;
        var tid = "" + req.body.tid;
        var serialNumber = "" + req.body.serialNumber;
        var affair = "请确认上岗审批";
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
                var link = '/homePage/memberpostCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&longTime=' + time + '&serialNumber=' + serialNumber;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE user set pnameCheck=? WHERE id=?', [one,id], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                connection.query('INSERT INTO user_post(id,name,department,duty,tid) VALUES(?,?,?,?,?)', [id,cname,department,duty,tid], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
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
router.get('/memberpostCheck', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var longTime = "" + param.longTime;
        var serialNumber = "" + param.serialNumber;
        var pname,datas,datas2,length;
        var content = "",score = "";
        connection.query("SELECT * FROM user_post WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                var obj_name = rows[0].name;
                var tids = rows[0].tid;
                var tid = tids.split(","); var last = tid.length - 1;
                var sql1 = "",sql2 = "";
                if (tid.length !== 1) {
                    for (var i = 0; i < tid.length - 1; i++) {
                        sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[i] + "' AND opinion='同意' UNION ALL ";
                        sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[i] + "' UNION ALL ";
                    }
                    sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[last] + "' AND opinion='同意'";
                    sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[last] + "'";
                }
                else {
                    sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[0] + "' AND opinion='同意'";
                    sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[0] + "'";
                }
                connection.query(sql1, function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        content = rows;
                    }        
                });
                connection.query(sql2, function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        datas2 = rows;
                        length = datas2.length;
                        for (var i = 0; i < datas2.length; i++) {
                            (function(i) {
                                var targets = datas2[i].target;
                                var scores = datas2[i].score;
                                var target = targets.split(",");
                                var scoress = scores.split(",");
                                for (var j = 0; j < target.length; j++) {
                                    if (target[j] == obj_name) {
                                        score += scoress[j] + ",";
                                    }
                                }
                            })(i);
                        }
                        score = score.substr(0, score.length - 1);
                        res.render('member/memberpostCheck', {datas:datas,id:id,password:password,name:cname,pname:pname,content:content,score:score,serialNumber:serialNumber,longTime:longTime});
                    }        
                });
            }
        });
        connection.release();   
    });    
});
router.post('/memberpostCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var mid = "" + req.body.mid;
        var longTime = "" + req.body.longTime;
        var serialNumber = "" + req.body.serialNumber;
        var opinion = "" + req.body.opinion;
        var remarks = "" + req.body.remarks;
        var zero = 0;
        var one = 1;
        var check_result;
        if (opinion == "同意") {
            check_result = 1;
        }
        else {
            check_result = 0;
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE user set pnameCheck=?,check_result=? WHERE id=?', [zero,check_result,mid], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    } else {
                        connection.query('UPDATE user_post set techName=?,opinion=?,remarks=? WHERE serialNumber=?', [cname,opinion,remarks,serialNumber], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                res.send("<script>alert('提交成功!');window.location.href = '/homePage?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
                            }
                        });
                    }
                });
            }
        });    
        connection.release();
    });  
});
router.get('/memberpostDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        var datas,datas2,length;
        var content = "",score = "";
        connection.query("SELECT * FROM user_post WHERE id='" + uid + "' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                var obj_name = rows[0].name;
                var tids = rows[0].tid;
                var tid = tids.split(","); var last = tid.length - 1;
                var sql1 = "",sql2 = "";
                if (tid.length !== 1) {
                    for (var i = 0; i < tid.length - 1; i++) {
                        sql1 = "SELECT * FROM train_manpower WHERE tid='" + tid[i] + "' AND opinion='同意' UNION ALL ";
                        sql2 = "SELECT * FROM train_manpower_check WHERE tid='" + tid[i] + "' UNION ALL ";
                    }
                    sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[last] + "' AND opinion='同意'";
                    sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[last] + "'";
                }
                else {
                    sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[0] + "' AND opinion='同意'";
                    sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[0] + "'";
                }
                connection.query(sql1, function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        content = rows;
                    }        
                });
                connection.query(sql2, function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        datas2 = rows;
                        length = datas2.length;
                        for (var i = 0; i < datas2.length; i++) {
                            (function(i) {
                                var targets = datas2[i].target;
                                var scores = datas2[i].score;
                                var target = targets.split(",");
                                var scoress = scores.split(",");
                                for (var j = 0; j < target.length; j++) {
                                    if (target[j] == obj_name) {
                                        score += scoress[j] + ",";
                                    }
                                }
                            })(i);
                        }
                        score = score.substr(0, score.length - 1);
                        res.render('member/memberpostDetail', {datas:datas,id:id,password:password,name:name,content:content,score:score});
                    }        
                });
            }
        });
        connection.release();   
    });    
});
router.post('/memberpostdetailCheck',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        connection.query("SELECT * FROM user_post WHERE id='" + uid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows.length == 0) {
                    return res.json({
                        errCode : 0,
                        errMsg : '未填写上岗审批表'
                    }); 
                } 
                else {
                    res.json({
                        errCode : 1,
                        errMsg : '满足权限条件'
                    });
                }             
            }
        });
        connection.release();   
    });
});
router.get('/trainingDetail', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var uid = "" + param.uid;
        var uname = "" + param.uname;
        var datas,datas2,length;
        var content = "",score = "";
        connection.query("SELECT * FROM user WHERE id=" + uid, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                datas = rows[0];
                if (rows[0].train_id == null) {
                    res.send("<script>alert('未完成任何培训');window.location.href = '/homePage/memberList?id=" + id + "&password=" + password + "&name=" + name +"';</script>");
                }
                else {
                    var obj_name = rows[0].userName;
                    var tids = rows[0].train_id;
                    var tid = tids.split(","); var last = tid.length - 1;
                    var sql1 = "",sql2 = "";
                    if (tid.length !== 1) {
                        for (var i = 0; i < tid.length - 1; i++) {
                            sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[i] + "' AND opinion='同意' UNION ALL ";
                            sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[i] + "' UNION ALL ";
                        }
                        sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[last] + "' AND opinion='同意'";
                        sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[last] + "'";
                    }
                    else {
                        sql1 += "SELECT * FROM train_manpower WHERE tid='" + tid[0] + "' AND opinion='同意'";
                        sql2 += "SELECT * FROM train_manpower_check WHERE tid='" + tid[0] + "'";
                    }
                    connection.query(sql1, function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            content = rows;
                        }        
                    });
                    connection.query(sql2, function (err, rows) {
                        if (err) {
                            return res.json({
                                errCode : 0,
                                errMsg : '提交失败'
                            });
                        }
                        else {
                            datas2 = rows;
                            length = datas2.length;
                            for (var i = 0; i < datas2.length; i++) {
                                (function(i) {
                                    var targets = datas2[i].target;
                                    var scores = datas2[i].score;
                                    var target = targets.split(",");
                                    var scoress = scores.split(",");
                                    for (var j = 0; j < target.length; j++) {
                                        if (target[j] == obj_name) {
                                            score += scoress[j] + ",";
                                        }
                                    }
                                })(i);
                            }
                            score = score.substr(0, score.length - 1);
                            res.render('member/trainingDetail', {datas:datas,id:id,password:password,name:name,content:content,score:score,uid:uid,uname:uname});
                        }        
                    });
                }
            }
        });
        connection.release();   
    });    
});
// 人员职责
router.get('/memberDuty', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var role1,role2,role3,role4,role5,role6,role7,role8,role9,role10,role11,role12;
        connection.query("SELECT * FROM user WHERE duty REGEXP '实验室主任'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role1 = rows;
            }
        });
        connection.query("SELECT * FROM user WHERE duty REGEXP '技术负责人'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role2 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '质量负责人'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role3 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '综合管理部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role4 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '测试技术部主管'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role5 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '测试员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role6 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '监督员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role7 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '资料档案管理员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role8 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '设备管理员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role9 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '审核员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role10 = rows;
            }
        }); 
        connection.query("SELECT * FROM user WHERE duty REGEXP '内审员'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role11 = rows;
            }
        });
        connection.query("SELECT * FROM user WHERE duty REGEXP '授权签字人'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                role12 = rows;
                res.render('member/memberDuty', {id:id,password:password,name:name,role1:role1,role2:role2,role3:role3,role4:role4,role5:role5,role6:role6,role7:role7,role8:role8,role9:role9,role10:role10,role11:role11,role12:role12});
            }
        });   
        connection.release();   
    });    
});
// 检测人员上岗审批
router.get('/duty', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var duty = "" + param.duty;
        if (duty == "1") {
            res.render('member/duty1', {id:id,password:password,name:name});
        }
        else if (duty == "2") {res.render('member/duty2', {id:id,password:password,name:name});}
        else if (duty == "3") {res.render('member/duty3', {id:id,password:password,name:name});}
        else if (duty == "4") {res.render('member/duty4', {id:id,password:password,name:name});}
        else if (duty == "5") {res.render('member/duty5', {id:id,password:password,name:name});}
        else if (duty == "6") {res.render('member/duty6', {id:id,password:password,name:name});}
        else if (duty == "7") {res.render('member/duty7', {id:id,password:password,name:name});}
        else if (duty == "8") {res.render('member/duty8', {id:id,password:password,name:name});}
        else if (duty == "9") {res.render('member/duty9', {id:id,password:password,name:name});}
        else if (duty == "10") {res.render('member/duty10', {id:id,password:password,name:name});}
        else if (duty == "11") {res.render('member/duty11', {id:id,password:password,name:name});}
        else if (duty == "12") {res.render('member/duty12', {id:id,password:password,name:name});}
        connection.release();   
    });    
});
module.exports = router;