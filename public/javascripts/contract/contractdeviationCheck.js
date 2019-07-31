function change(condition){ 
  var conditions = condition.split(";");
  var name = "";
  for(i = 0; i < conditions.length; i++){
    if (conditions[i] !== "") {
      name += "<label class='form-label'>" + conditions[i] + "</label>";
    }
  }
  document.getElementById("condition").insertAdjacentHTML("beforeEnd",name);
}
function change2(){ 
  var result = $('#opinions').val();
  if (result == "不同意") {
    $("#no").show();
    $('#no').val("");
    $("#yes").hide();
    $('#yes').val("");
    $("#yes").removeAttr("required");
  }
  else {
    $("#yes").show();
    $('#yes').val("");
    $("#yes").prop("required","true");
    $("#no").hide();
    $('#no').val("");
  }
}