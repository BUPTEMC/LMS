function judgelength() {
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}
function clearName(str) {
  var xmlhttp, flag; //flag = 1表示未查到
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      flag = xmlhttp.responseText;
      if(flag == "yes") {
        $("#activityname").val("");
        alert("活动名称已存在");
      }
    }
  }
  xmlhttp.open("GET","/homePage/clearactivity?name="+str,true);
  xmlhttp.send();
}