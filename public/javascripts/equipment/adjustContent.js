function rangeSelect(){
  var rangeid = document.getElementById("range_select").value;
  if (rangeid == 1) {
    $('#input-example-2').attr("readonly",true);
    $('#input-example-2').removeAttr("required");
    $('#input-example-2').val("");
    $('#input-example-3').attr("required",true);
    $('#input-example-3').removeAttr("readonly");
    $('#input-example-3').val("");
  }
  else if (rangeid == 0) {
    $('#input-example-3').attr("readonly",true);
    $('#input-example-3').removeAttr("required");
    $('#input-example-3').val("");
    $('#input-example-2').attr("required",true);
    $('#input-example-2').removeAttr("readonly");
    $('#input-example-2').val("");
  }
  else {
    $('#input-example-3').attr("required",true);
    $('#input-example-3').removeAttr("readonly");
    $('#input-example-3').val("");
    $('#input-example-2').attr("required",true);
    $('#input-example-2').removeAttr("readonly");
    $('#input-example-2').val("");
  }
}