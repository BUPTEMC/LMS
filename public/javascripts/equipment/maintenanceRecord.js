function equipmentname(eid,ename){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  if(selectid == "") {
    window.history.back();
  }
  for (i = 0; i < eid.length; i++) {
    if (eid[i] == selectid) {
      flag = i;
    }
  }
  var epushname = ename[flag];
  document.getElementById('input-example-2').value = epushname;
}
//当前日期日期
function today() {
  // 给input  date设置默认值
  var now = new Date();
  //格式化日，如果小于9，前面补0
  var day = ("0" + now.getDate()).slice(-2);
  //格式化月，如果小于9，前面补0
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  //拼装完整日期格式
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  //完成赋值
  document.getElementById('input-example-4').value = today;
}
function judgelength() {
  var checkbox = document.getElementsByName('member');
  var checkbox2 = document.getElementsByName('content');
  var num1 = 0;
  var num2 = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num1++;
    }  
  }
  for (var i = 0; i < checkbox2.length; i++) {
    if (checkbox2[i].checked == true) {
      num2++;
    }  
  }
  if (num1 < 1) {
    alert("请勾选保养人员");
    return false;
  }
  else if (num2 < 1) {
    alert("请勾选保养内容");
    return false;
  }
}