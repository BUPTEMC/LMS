function change(){
  var selectid = document.getElementById("pname").value;
  if(selectid == "") {
    alert("没有申请扩项的项目")
    window.history.back();
  }
}