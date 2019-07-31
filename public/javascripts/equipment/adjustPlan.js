function equipmentinfo(eid,ename,version,manufactureNum,beforecredentialNumber,nextadjustDate){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  var name = "";
  if(selectid == "") {
    window.history.back();
  }
  for (i = 0; i < eid.length; i++) {
    if (eid[i] == selectid) {
      flag = i;
    }
  }
  var epushname = ename[flag];
  var epushversion = version[flag];
  var epushmanufactureNum = manufactureNum[flag];
  var epushbeforecredentialNumber = beforecredentialNumber[flag];
  var epushnextadjustDate = nextadjustDate[flag];
  document.getElementById('input-example-2').value = epushname;
  document.getElementById('input-example-3').value = epushversion;
  document.getElementById('input-example-4').value = epushmanufactureNum;
  document.getElementById('credentialNumber-input').value = epushbeforecredentialNumber;
  document.getElementById('credentialTime-input').value = epushnextadjustDate;
}
function equipmentinfoON(){
  var credentialid = document.getElementById("credential-select").value;
  if (credentialid == 0) {
    $('#credentialNumber-input').attr("readonly",true);
    $('#credentialTime-input').attr("readonly",true);
    $('#credentialNumber-input').removeAttr("required");
    $('#credentialTime-input').removeAttr("required");
    $('#credentialNumber-input').val("");
    $('#credentialTime-input').val("");
  }
  else {
    $('#credentialNumber-input').removeAttr("readonly");
    $('#credentialTime-input').removeAttr("readonly");
    $('#credentialNumber-input').attr("required",true);
    $('#credentialTime-input').attr("required",true);
  }
}
function judgelength() {
  var checkbox = document.getElementsByName('item');
  var num = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num++;
    }  
  }
  if (num < 1) {
    alert("请勾选校准内容");
    return false;
  }
}