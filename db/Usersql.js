var UserSQL = {
    insertUserInfo: 'INSERT INTO userInfo(id,password,email) VALUES(?,?,?)', // 插入用户数据
    getUserInfo: 'SELECT * FROM user', // 获取用户数据
    getequipment: 'SELECT id,name FROM equipment WHERE acceptedOpinion=0', //获取未入库设备数据
    delUser: "delete from userInfo where id=?", // 删除用户
    updateUser: 'select * from userInfo where id=?', // 更新用户
    insert: 'INSERT INTO User(password,userName,duty) VALUES(?,?,?)', // 插入数据
    update: 'UPDATE User SET uid=?,userName=? WHERE uid=?', // 更新数据
    delete: 'DELETE FORM User WHERE uid=?', // 删除表中符合条件的数据
    drop: 'DROP TABLE User', // 删除表中所有的数据
    queryAll: 'SELECT * FROM User', // 查找表中所有数据
    getUserActive: "SELECT * FROM User WHERE state = '在职'", // 查找符合条件的数据
    getUsers: "SELECT * FORM User WHERE userName like '%?%'", // 查询符合条件的数据，模糊查询
    insertequipment: 'INSERT INTO equipment(id,name,source,appearanceCheck,assembled,startingUp,storage,shutdown,measure,newDegree,checkedMember,acceptedOpinion,acceptedDate,accessoryName,accessoryNumber,version,manufactureNum,manufactureDate,manufacturer,price,saveMember,correct,accuracyItem,accuracyRange,runningState,putaway) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',//设备验收插入
    recheckequipment: 'UPDATE equipment SET source=?,appearanceCheck=?,assembled=?,startingUp=?,storage=?,shutdown=?,measure=?,newDegree=?,checkedMember=?,acceptedOpinion=?,acceptedDate=?,accessoryName=?,accessoryNumber=?,version=?,manufactureNum=?,manufactureDate=?,manufacturer=?,price=?,saveMember=?,correct=?,accuracyItem=?,accuracyRange=?,runningState=?,putaway=? WHERE id=? AND name=?',//设备验收修改
    insertform_inout: 'INSERT INTO form_inout(eid,ename,getequipmentTime,getequipmentReason,member,saveMember,state) VALUES(?,?,?,?,?,?,?)',//设备出库表单
    rechecform_inout: 'UPDATE form_inout SET returnTime=?,returnState=?,checkMember=?,remarks=?,state=?,returnMember=? WHERE eid=? AND state=?', //仪器归还
    insertcontacts: 'INSERT INTO contacts(name,telephone,organization) VALUES(?,?,?)', //添加外部联系人
    insertform_useCheck: 'INSERT INTO form_use(eid,ename,member,startTime,endTime,remarks) VALUES(?,?,?,?,?,?)', //填form_useCheck表
    insertform_adjust_plan: 'INSERT INTO form_adjust_plan(eid,ename,version,manufactureNumber,adjustItem,adjustTime,period,adjustOrganization,adjustplanTime,credentialNumber,credentialTime,adjustReason) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
    insertform_adjust_record: 'INSERT INTO form_adjust_record(eid,ename,version,manufactureNumber,adjustTime,period,credentialNumber,adjustItem,uncertainty,adjustCheck,adjustOrganization,changeReason,changeState,file,realTime,adjustrecordTime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    insertform_maintenance: 'INSERT INTO form_maintenance(eid,ename,member,maintenanceTime,maintenanceContent,remarks) VALUES(?,?,?,?,?,?)',
    insertform_repair_apply: 'INSERT INTO form_repair_apply(eid,ename,member,time,reason,longTime) VALUES(?,?,?,?,?,?)',
    insertform_repair_check: 'INSERT INTO form_repair_check(eid,ename,member,leaveTime,returnTime,reason,checkResult,checkMember) VALUES(?,?,?,?,?,?,?,?)'
};
module.exports = UserSQL;