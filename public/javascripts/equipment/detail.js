function getCookie(c_name){
  if (document.cookie.length>0){
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1){ 
      c_start = c_start + c_name.length+1; 
      c_end = document.cookie.indexOf(";",c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
  return "";
}
// 预填表
function checkuserCookiedetail(id,password,name,correct,adjust,adjusted,runningState,breakdown,repair){
  username = getCookie('username');
  key = getCookie('password');
  // cookie密码与地址中信息不同则表面身份不吻合，重新登录
  var flag = 0;
  if(username == id && password == key){
    flag = 1;
  }
  if(!flag)
  window.location.href="/";
  if(runningState == "禁用"){
    if(correct && !adjust){
      document.getElementById("disableReason").innerHTML = "未经检定或校准";
    }
    else if(correct && adjust && !adjusted){
      document.getElementById("disableReason").innerHTML = "经检定或校准不合格";
    }
    else if(breakdown && !repair){
      document.getElementById("disableReason").innerHTML = "出现故障";
  }
    }
}
// 配件
function accessorys(accessoryName,accessoryNumber){
  var accessoryname = accessoryName.split(",");
  var accessorynumber = accessoryNumber.split(",");
  var name = "";
  // 项目无数据
  if(accessoryName == ""){
    document.getElementById("accessorys_td").innerHTML = "无";
  }
  // 项目有数据以表格显示
  else{
    for(var i = 0; i < accessoryname.length; i++){
    name += "<tr><td>" + accessoryname[i] + "</td><td>" + accessorynumber[i] + "</td></tr>"
    }
    document.getElementById("accessorys_tbody").insertAdjacentHTML("beforeEnd",name);
  }
}
// 精度
function accuracy(accessoryItem,accessoryRange){
  var accessoryitem = accessoryItem.split(";");
  var accessoryrange = accessoryRange.split(";");
  var name="";
  if (accessoryItem == "") {
    document.getElementById("accuracy_td").innerHTML = "无";
  }
  else{
    for(var i = 0; i < accessoryitem.length; i++){
    name += "<tr><td>" + accessoryitem[i] + "</td><td>" + accessoryrange[i] + "</td></tr>"
  }
    document.getElementById("accuracy_tbody").insertAdjacentHTML("beforeEnd",name);
  }
}
// 检定或校准
function correct(Correct){
  var correct = Correct;
  if (correct) {
    document.getElementById("correct_td").innerHTML = "设备需要检定或校准";
  }
  else{
    document.getElementById("correct_td").innerHTML = "设备不需要检定或校准";
  }
}