function equipmentinfoON(eid,ename,version,manufactureNum,manufacturer){
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
  var epushmanufacturer = manufacturer[flag];
  document.getElementById('input-example-2').value = epushname;
  document.getElementById('input-example-3').value = epushversion;
  document.getElementById('input-example-4').value = epushmanufactureNum;
  document.getElementById('input-example-5').value = epushmanufacturer;
}