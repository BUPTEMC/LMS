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
function checkuserCookie(id,password,name){
  username = getCookie('username');
  key = getCookie('password');
  // cookie密码与地址中信息不同则表面身份不吻合，重新登录
  var flag = 0;
  if(username == id && password == key){
    flag = 1;
  }
  if(!flag)
  window.location.href="/";
}