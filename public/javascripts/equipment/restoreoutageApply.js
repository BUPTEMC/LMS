function equipmentinfoON(eid,ename,version,outageTime,manufacturer){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  var name = "";
  if(selectid !== "") {
    for (i = 0; i < eid.length; i++) {
      if (eid[i] == selectid) {
        flag = i;
      }
    }
    var epushname = ename[flag];
    var epushversion = version[flag];
    var epushoutageTime = outageTime[flag];
    var epushmanufacturer = manufacturer[flag];
    document.getElementById('input-example-2').value = epushname;
    document.getElementById('input-example-3').value = epushversion;
    document.getElementById('input-example-4').value = epushmanufacturer;
    document.getElementById('input-example-5').value = epushoutageTime;
  }
  else {
    window.history.back();
  }  
}