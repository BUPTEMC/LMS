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
function judgelength() {
  var checkbox = document.getElementsByName('content');
  var num = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num++;
    }  
  }
  if (num < 1) {
    alert("请勾选维修原因");
    return false;
  }
}