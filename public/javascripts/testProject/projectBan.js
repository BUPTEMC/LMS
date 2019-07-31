function judgelength() {
	var checkbox = document.getElementsByName('banReason');
	var num = 0;
	for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num++;
    }  
	}
	if (num < 1) {
    alert("请勾选停止原因");
    return false;
  }
	var gnl = confirm("确定要提交?");
	if (gnl == true){
  	return true;
	} else {
  	return false;
	}
}