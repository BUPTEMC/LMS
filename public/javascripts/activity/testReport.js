function ypinfoON(ypid,position,type,lola){
  var selectid = document.getElementById("ypids").value;
  var i = 0;
  var flag;
  for (i = 0; i < ypid.length; i++) {
    if (ypid[i] == selectid) {
      flag = i;
    }
  }
  var epushposition = position[flag];
  var epushtype = type[flag];
  var epushlola = lola[flag];
  $("#input-example-2").html(epushposition);
  $("#input-example-3").html(epushtype);
  $("#input-example-4").html(epushlola);
  $('#pos').val(epushposition);
  $('#tys').val(epushtype);
  $('#los').val(epushlola);
}
function change1(result) {
  if (result == "是") {
    $("#1_reason").show();
    isClick2 = false;
  }
  else {
    $("#1_reason").hide();
    isClick2 = true;
  }
}