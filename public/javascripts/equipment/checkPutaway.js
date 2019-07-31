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
function checkuserCookie(id,password,name,accepted,registered){
  username = getCookie('username');
  key = getCookie('password');
  tag_check = "<a class='timeline-icon icon-lg tooltip' href='' data-tooltip='验收完成'><i class='icon icon-check'></i></a>";
  tag_register = "<a class='timeline-icon icon-lg tooltip' href='' data-tooltip='登记完成'><i class='icon icon-check'></i></a>"
  tag_confirm = "<a class='timeline-icon icon-lg tooltip' href='' data-tooltip='入库完成请确认'><i class='icon icon-check'></i></a>"
  register_btn = "<a href=''><button class='btn'>登记</button></a>";
  confirm_btn = "<a href=''><button class='btn'>确认</button></a>";
  // cookie密码与地址中信息不同则表面身份不吻合，重新登录
  var flag = 0;
  if(username == id && password == key){
    flag = 1;
  }
  if(!flag)
  window.location.href="/";
  // 验收未登记
  if(accepted && !registered){
    var btn_register = document.getElementById("register_btn");
    var step1 = document.getElementById("step1");
    var step2 = document.getElementById("step2");
    step1.className = 'step-item';
    step2.className = 'step-item active';
    btn_register.parentNode.removeChild(btn_register);
    document.getElementById("register_btn_parent").insertAdjacentHTML("beforeEnd",register_btn);
  }
  // 验收且登记
  else if(accepted && registered){
    var step1 = document.getElementById("step1");
    var step2 = document.getElementById("step2");
    var step3 = document.getElementById("step3");
    step1.className = 'step-item';
    step2.className = 'step-item';
    step3.className = 'step-item active';
    //两个按钮
    var btn_register = document.getElementById("register_btn");
    btn_register.parentNode.removeChild(btn_register); 
    document.getElementById("register_btn_parent").insertAdjacentHTML("beforeEnd",register_btn);
    var btn_confirm = document.getElementById("confirm_btn");
    btn_confirm.parentNode.removeChild(btn_confirm); 
    document.getElementById("confirm_btn_parent").insertAdjacentHTML("beforeEnd",confirm_btn);
  }
}