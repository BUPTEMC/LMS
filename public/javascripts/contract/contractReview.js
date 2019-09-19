function change(conid,pname,organization){
  var selectid = document.getElementById("contraid").value;
  var i = 0;
  var flag;
  if(selectid == "") {
    alert("不满足评审条件!")
    window.history.back();
  }
  for (i = 0; i < conid.length; i++) {
    if (conid[i] == selectid) {
      flag = i;
    }
  }
  var pushpname = pname[flag];
  var pushorganization = organization[flag];
  document.getElementById('input-2').value = pushpname;
  document.getElementById('input-3').value = pushorganization;
}
function judgelength() {
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}