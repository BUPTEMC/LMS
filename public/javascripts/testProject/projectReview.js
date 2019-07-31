function change(name,criterion){
  var selectid = document.getElementById("pname").value;
  var i = 0;
  var flag;
  if(selectid == "") {
    window.history.back();
  }
  for (i = 0; i < name.length; i++) {
    if (name[i] == selectid) {
      flag = i;
    }
  }
  var epushcriterion = criterion[flag];
  document.getElementById('input-2').value = epushcriterion;
}
function judgelength() {
  var checkbox = document.getElementsByName('member');
  var num = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num++;
    }  
  }
  if (num < 1) {
    alert("请勾选参加评审人员");
    return false;
  }
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}