var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
var sd = require('silly-datetime');
var dateFormat = require('dateformat');
var uploadfile = require('./../model/upload-file');//上传文件model
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
        var flag;
        connection.query("SELECT * FROM standard WHERE state='正常使用'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if (rows.length == 0) {
                    flag = 0;
                } 
                else {
                    flag = 1;
                }
                connection.query("SELECT * FROM file WHERE state!='已作废' order by serialNumber desc", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('file/fileManagement', {datas:rows,id:id,password:password,name:name,flag:flag}); 
                    }
                });
            }
        });
        connection.release();
    });
});
// 查看流程及权限
router.get('/explain', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        res.render('file/explain', {id:id,password:password,name:name});
        connection.release();   
    });    
});
// 新建文件权限
router.post('/newfile_authority',function(req,res){
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
                if(rows[0].duty.indexOf("质量负责人") == -1 && rows[0].duty.indexOf("技术负责人") == -1) {
                    return res.json({
                        errCode : 0,
                        errMsg : '仅质量负责人或技术负责人有权访问'
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
// 新建培训
router.get('/newFile', function(req, res, next) {
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
                res.render('file/newFile', {datas:rows,id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
router.get('/clearFile', function(req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var name = "" + param.name;
        if(name != ""){
            connection.query("SELECT fid FROM file WHERE fid='" + name + "'", function (err, rows) {
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
router.post('/newFile', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var fid = "" + req.body.fid;
        var fname = "" + req.body.fname;
        var standard = "" + req.body.standard;
        var state = "等待发布";
        connection.query('INSERT INTO file(fid,fname,standard,state,editor) VALUES(?,?,?,?,?)', [fid,fname,standard,state,cname], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/fileManagement?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
// 文件详情
router.get('/fileDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var fid = "" + param.fid;
        connection.query("SELECT * FROM file WHERE fid='" + fid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/fileDetail', {datas:rows[0],id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 发布文件权限
router.post('/publishauthority',function(req,res){
    /**设置响应头允许ajax跨域访问**/
    res.setHeader("Access-Control-Allow-Origin","*");
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var fid = "" + param.fid;
        connection.query("SELECT editor FROM file WHERE fid='" + fid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                if(rows[0].editor !== name) {
                    return res.json({
                        errCode : 0,
                        errMsg : '仅文件编制人有权访问'
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
// 发布文件
router.get('/publish', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var fid = "" + param.fid;
        var today = dateFormat(new Date(), "yyyy-mm-dd");
        connection.query("SELECT * FROM file WHERE fid='" + fid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/publish', {datas:rows[0],id:id,password:password,name:name,today:today}); 
            }
        });  
        connection.release();
    });
});
// 上传文件
router.post('/fileUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var fid = "" + param.fid;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadfile.uploadPhoto(req,'images',function(err,fields,uploadPath){
            if(err){
                return res.json({
                    errCode : 0,
                    errMsg : '上传错误'
                });
            }
            console.log(fields);    //表单中字段信息
            console.log(uploadPath);    //上传图片的相对路径
            connection.query("UPDATE file SET file_url='" + uploadPath + "' WHERE fid='" + fid + "'", function (err, rows) {
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
router.post('/publish', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var fid = "" + req.body.fid;
        var publish_date = "" + req.body.publish_date;
        var implement_date = "" + req.body.implement_date;
        var state = "已发布";
        connection.query('UPDATE file set publish_date=?,implement_date=?,state=? WHERE fid=?', [publish_date,implement_date,state,fid], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/fileManagement?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
// 修改文件
router.get('/modify', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var fid = "" + param.fid;
        var standard;
        connection.query("SELECT * FROM standard", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                standard = rows;
                connection.query("SELECT * FROM file WHERE fid='" + fid + "'", function (err, rows) {
                    if (err) {
                        res.status(404).end(); 
                    } 
                    else {
                        res.render('file/modify', {standard:standard,datas:rows[0],id:id,password:password,name:name}); 
                    }
                });  
            }
        }); 
        connection.release();
    });
});
// 上传修改文件
router.post('/file_modifyUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var fid = "" + param.fid;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadfile.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/modify', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var fid = "" + req.body.fid;
        var fid_old = "" + req.body.fid_old;
        var fname = "" + req.body.fname;
        var standard = "" + req.body.standard;
        var content = "" + req.body.content;
        var file_Url = "" + req.body.file_Url;
        var affair = "请确认文件修改申请";
        var serialNumber;
        var one = 1;
        connection.query("SELECT * FROM file_modify", function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            } else {
                serialNumber = rows.length + 1;
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
                var link = '/fileManagement/modifyCheck?id=' + userid + '&password=' + userpassword + '&name=' + username + '&serialNumber=' + serialNumber + '&longTime=' + time;
                connection.query("INSERT INTO " + dataform + "(sender,time,affair,link) VALUES(?,?,?,?)", [cname,time,affair,link], function (err, rows) {
                    if (err) {
                        return res.json({
                            errCode : 0,
                            errMsg : '提交失败'
                        });
                    }
                    else {
                        connection.query('UPDATE file set modify_state=? WHERE fid=?', [one,fid_old], function (err, rows) {
                            if (err) {
                                return res.json({
                                    errCode : 0,
                                    errMsg : '提交失败'
                                });
                            } else {
                                connection.query('INSERT INTO file_modify(fid,fid_old,fname,standard,content,file_Url,applicant) VALUES(?,?,?,?,?,?,?)', [fid,fid_old,fname,standard,content,file_Url,cname], function (err, rows) {
                                    if (err) {
                                        return res.json({
                                            errCode : 0,
                                            errMsg : '提交失败'
                                        });
                                    } else {
                                        res.send("<script>alert('提交成功');window.location.href = '/fileManagement/fileDetail?id=" + id + "&password=" + password + "&name=" + cname + "&fid=" + fid_old + "';</script>");
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
router.get('/modifyCheck', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var serialNumber = "" + param.serialNumber;
        var longTime = "" + param.longTime;
        connection.query("SELECT * FROM file_modify WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/modifyCheck', {datas:rows[0],id:id,password:password,name:name,longTime:longTime}); 
            }
        }); 
        connection.release();
    });
});
router.post('/modifyCheck', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        var message_form = "message_" + id;
        // 表单
        var fid = "" + req.body.fid;
        var fname = "" + req.body.fname;
        var standard = "" + req.body.standard;
        var editor = "" + req.body.editor;
        var fid_old = "" + req.body.fid_old;
        var longTime = "" + req.body.longTime;
        var serialNumber = "" + req.body.serialNumber;
        var opinion = "" + req.body.opinion;
        var opinionRemarks = "" + req.body.remarks;
        var state;
        var state_ = "等待发布";
        var zero = 0;
        if (opinion == "同意") {
            state = "已作废";
            connection.query('INSERT INTO file(fid,fname,standard,state,editor) VALUES(?,?,?,?,?)', [fid,fname,standard,state_,editor], function (err, rows) {
                if (err) {
                    res.status(404).end();
                }      
            });
        }
        else {
            state = "已发布";
        }
        connection.query("UPDATE " + message_form + " SET see=1 WHERE time='" + longTime + "'", function (err, rows) {
            if (err) {
                res.status(404).end();
            }
            else {
                connection.query('UPDATE file set state=?,modify_state=? WHERE fid=?', [state,zero,fid_old], function (err, rows) {
                    if (err) {
                        res.status(404).end();
                    }
                    else {
                        connection.query('UPDATE file_modify set chairman_name=?,opinion=?,remarks=? WHERE serialNumber=?', [cname,opinion,opinionRemarks,serialNumber], function (err, rows) {
                            if (err) {
                                res.status(404).end();
                            }
                            else {
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
// 文件修改详情
router.get('/modifyDetail', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var fid = "" + param.fid;
        connection.query("SELECT * FROM file_modify WHERE fid_old='" + fid + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/modifyDetail', {datas:rows,id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 文件修改内容
router.get('/modifyContent', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var serialNumber = "" + param.serialNumber;
        connection.query("SELECT * FROM file_modify WHERE serialNumber=" + serialNumber, function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/modifyContent', {datas:rows[0],id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 查询作废文件
router.get('/cancel', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM file WHERE state='已作废'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/cancel', {datas:rows,id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 外来受控文件
router.get('/external', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        connection.query("SELECT * FROM file_external", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('file/external', {datas:rows,id:id,password:password,name:name}); 
            }
        });  
        connection.release();
    });
});
// 登记外来受控文件
router.get('/register', function(req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var name = "" + param.name;
        var year_,num_,last,num,year,ym;
        ym = dateFormat(new Date(), "yyyymm");
        connection.query("SELECT * FROM file_external", function (err, rows) {
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
                var fid = "WLSKWJ-" + year + "-" + (Array(4).join('0') + num).slice(-4);
                res.render('file/register', {fid:fid,id:id,password:password,name:name,year:year,num:num}); 
            }
        });  
        connection.release();
    });
});
// 上传修改文件
router.post('/externalUpload',function(req,res){
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        /**设置响应头允许ajax跨域访问**/
        res.setHeader("Access-Control-Allow-Origin","*");
        uploadfile.uploadPhoto(req,'images',function(err,fields,uploadPath){
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
router.post('/register', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        var cname = "" + param.name;
        // 表单
        var fid = "" + req.body.fid;
        var fname = "" + req.body.fname;
        var year = "" + req.body.year;
        var num = "" + req.body.num;
        var sum = "" + req.body.sum;
        var source = "" + req.body.source;
        var recipient = "" + req.body.recipient;
        var date = "" + req.body.date;
        var checker = "" + req.body.checker;
        var file_url = "" + req.body.file_url;
        connection.query('INSERT INTO file_external(fid,fname,year,num,sum,source,recipient,date,checker,file_url) VALUES(?,?,?,?,?,?,?,?,?,?)', [fid,fname,year,num,sum,source,recipient,date,checker,file_url], function (err, rows) {
            if (err) {
                return res.json({
                    errCode : 0,
                    errMsg : '提交失败'
                });
            }
            else {
                res.send("<script>alert('提交成功!');window.location.href = '/fileManagement/external?id=" + id + "&password=" + password + "&name=" + cname +"';</script>");
            }      
        });    
        connection.release();
    });  
});
module.exports = router;