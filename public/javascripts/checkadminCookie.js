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
function checkadminCookie(id,password){
  username = getCookie('username');
  password = getCookie('password');
  // 000000md5加密为password_alter
  password_alter = md5("000000");
  if (username !== id || password !== password){
    window.location.href="/";
  }
}