var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
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

/* GET admin page. */
router.get('/', function(req, res, next) {
  var param = req.query || req.params;
  var id = "" + param.id;
  var password = "" + param.password;
  pool.getConnection(function (err, connection) {
    connection.query(userSQL.getUserInfo, function (err, rows) {
        if (err) {
            res.render('admin', {title:'Express',datas:[]}); 
        } 
        else {
            res.render('admin', {title:'Express',datas:rows,id:id,password:password});
        }
        connection.release();
    });
  });    
});
router.get('/testProject', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        connection.query("SELECT * FROM testproject WHERE finalOpinion='同意' order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('admin/testproject/project', {datas:rows,id:id,password:password}); 
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
        var pname = "" + param.pname;
        connection.query("SELECT * FROM testproject WHERE name='" + pname + "'", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('admin/testproject/projectDetail', {datas:rows[0],id:id,password:password}); 
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
        connection.query("SELECT * FROM testproject order by serialNumber desc", function (err, rows) {
            if (err) {
                res.status(404).end(); 
            } 
            else {
                res.render('admin/testproject/projectapplyShow', {datas:rows,id:id,password:password}); 
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
        connection.query(userSQL.getUserInfo, function (err, rows) {
          if (err) {
              res.status(404).end(); 
          } 
          else {
              res.render('admin/testproject/projectApply', {datas1:datas1,datas2:datas2,datas:rows,id:id,password:password});
          }   
        }); 
        connection.release();   
    });    
});
router.post('/testprojectApply', function (req, res) {
    pool.getConnection(function (err, connection) {
        // cookie
        var param = req.query || req.params;
        var id = "" + param.id;
        var password = "" + param.password;
        // 表单
        var name = req.body.name;
        var goal = req.body.goal;
        var demand = req.body.demand;
        var benefit = req.body.benefit;
        var content = req.body.content;
        var conditionContent = "" + req.body.conditionContent;
        var feasibility = req.body.feasibility;
        var price = req.body.price;
        connection.query('UPDATE default_testprojectapply set name=?,goal=?,demand=?,benefit=?,content=?,conditionContent=?,feasibility=?,price=?', [name,goal,demand,benefit,content,conditionContent,feasibility,price], function (err, rows) {
            if (err) {
                res.send("<script>alert('提交失败');window.location.href = '/admin/testprojectApply?id=" + id + "&password=" + password + "';</script>");
            } else {
                res.send("<script>alert('提交成功');window.location.href = '/admin/testprojectApply?id=" + id + "&password=" + password + "';</script>");
            }
        });       
        connection.release();
    });  
});
module.exports = router;