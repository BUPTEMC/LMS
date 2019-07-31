function equipmentname(eid,ename,member,reason){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  if(selectid !== "") {
    for (i = 0; i < eid.length; i++) {
      if (eid[i] == selectid) {
        flag = i;
      }
    }
    var epushname = ename[flag];
    var epushmember = member[flag];
    var epushreason = reason[flag];
    document.getElementById('input-example-2').value = epushname;
    document.getElementById('input-example-3').value = epushmember;
    document.getElementById('input-example-6').value = epushreason;
  }
  else {
    window.history.back();
  }     
}