function change(conname,conaddress,concontact,contele){
  var selectid = document.getElementById("contraname").value;
  var i = 0;
  var flag;
  if(selectid == "") {
    alert("无分包方!")
    window.history.back();
  }
  for (i = 0; i < conname.length; i++) {
    if (conname[i] == selectid) {
      flag = i;
    }
  }
  var pushconaddress = conaddress[flag];
  var pushconcontact = concontact[flag];
  var pushcontele = contele[flag];
  document.getElementById('input-2').value = pushconaddress;
  document.getElementById('input-3').value = pushconcontact;
  document.getElementById('input-4').value = pushcontele;
}
function judgelength() {
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}