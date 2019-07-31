function add() {
	var part_0 = "<div class='form-group'>"
	var part_1 = "<div class='col-3'></div>";
	var part_2 = "<div class='col-1'><label class='form-label'>名称</label></div>";
	var part_3 = "<div class='col-3'><input class='form-input' placeholder='配件名称' name='acceName' required='required'></div>"
	var part_4 = "<div class='col-1'></div><div class='col-1'><label class='form-label'>数量</label></div>";
	var part_5 = "<div class='col-1'><input class='form-input' type='number' placeholder='1' name='acceNum' required='required'></div>";
	var part_6 = "<div class='col-1'></div><div class='col-1'><button type='button' onclick='minus(this)' class='btn btn-primary btn-action'><i class='icon icon-minus'></i></button></div></div>"
  var add = "" +part_0 + part_1 + part_2 + part_3 + part_4 + part_5 + part_6;
    document.getElementById("plus").insertAdjacentHTML("beforeEnd",add);
}
function minus(Obj) {
  Obj.parentNode.parentNode.parentNode.removeChild(Obj.parentNode.parentNode);
}
function add2() {
	var part_0 = "<div class='form-group'>"
	var part_1 = "<div class='col-3'></div>";
	var part_2 = "<div class='col-2'><select class='form-select' name='accuracyItem'><option value='量程'>量程</option><option value='频率范围'>频率范围</option><option value='最小刻度'>最小刻度</option><option value='最大误差'>最大误差</option></select></div>";
	var part_3 = "<div class='col-1'></div>"
	var part_4 = "<div class='col-4'><input class='form-input' placeholder='示例：0.2 -1v/m' id='input-example-19' name='accuracyRange' required='required'></div><div class='col-1'></div><div class='col-1'><button type='button' onclick='minus(this)' class='btn btn-primary btn-action'><i class='icon icon-minus'></i></button></div></div>";
	var add = "" +part_0 + part_1 + part_2 + part_3 + part_4;
    document.getElementById("plus2").insertAdjacentHTML("beforeEnd",add);
}
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
function checkuserCookieandpush(id,password,name,source){
  username = getCookie('username');
  key = getCookie('password');
  // cookie密码与地址中信息不同则表面身份不吻合，重新登录
  var flag = 0;
  if(username == id && password == key){
    flag = 1;
  }
  if(!flag)
  window.location.href="/";
  document.getElementById(source).selected=true;
}
// 判断设备id是否历史存在
function judgeid(id) {
  var selectid = document.getElementById("input-example-8").value;
  var i = 0;
  var flag;
  for (i = 0; i < id.length; i++) {
    if (id[i] == selectid) {
      alert("设备编号重复");
      document.getElementById('input-example-8').value = "";
    }
  }
}
//设置验收日期
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
  document.getElementById('input-example-21').value = today;
}