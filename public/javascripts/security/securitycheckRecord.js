function sanitation_f(result) {
  if (result == "不合格") {
    $("#sanitationReasonID").show();
    $('#sanitationReason_id').val("");
    $("#sanitationReason_id").prop("required","true");
  }
  else {
    $("#sanitationReasonID").hide();
    $('#sanitationReason_id').val("");
    $("#sanitationReason_id").removeAttr("required");
  }
}
function electricity_f(result) {
  if (result == "不合格") {
    $("#electricityReasonID").show();
    $('#electricityReason_id').val("");
    $("#electricityReason_id").prop("required","true");
  }
  else {
    $("#electricityReasonID").hide();
    $('#electricityReason_id').val("");
    $("#electricityReason_id").removeAttr("required");
  }
}
function equipment_f(result) {
  if (result == "不合格") {
    $("#equipmentReasonID").show();
    $('#equipmentReason_id').val("");
    $("#equipmentReason_id").prop("required","true");
  }
  else {
    $("#equipmentReasonID").hide();
    $('#equipmentReason_id').val("");
    $("#equipmentReason_id").removeAttr("required");
  }
}
function route_f(result) {
  if (result == "不合格") {
    $("#routeReasonID").show();
    $('#routeReason_id').val("");
    $("#routeReason_id").prop("required","true");
  }
  else {
    $("#routeReasonID").hide();
    $('#routeReason_id').val("");
    $("#routeReason_id").removeAttr("required");
  }
}
function loadsanitation() {
	var result = $('#sanitationID').val();
  if (result == "不合格") {
    $("#sanitationReasonID").show();
    $('#sanitationReason_id').val("");
    $("#sanitationReason_id").prop("required","true");
  }
  else {
    $("#sanitationReasonID").hide();
    $('#sanitationReason_id').val("");
    $("#sanitationReason_id").removeAttr("required");
  }
}
function loadelectricity() {
	var result = $('#electricityID').val();
  if (result == "不合格") {
    $("#electricityReasonID").show();
    $('#electricityReason_id').val("");
    $("#electricityReason_id").prop("required","true");
  }
  else {
    $("#electricityReasonID").hide();
    $('#electricityReason_id').val("");
    $("#electricityReason_id").removeAttr("required");
  }
}
function loadequipment() {
	var result = $('#equipmentID').val();
  if (result == "不合格") {
    $("#equipmentReasonID").show();
    $('#equipmentReason_id').val("");
    $("#equipmentReason_id").prop("required","true");
  }
  else {
    $("#equipmentReasonID").hide();
    $('#equipmentReason_id').val("");
    $("#equipmentReason_id").removeAttr("required");
  }
}
function loadroute() {
	var result = $('#routeID').val();
  if (result == "不合格") {
    $("#routeReasonID").show();
    $('#routeReason_id').val("");
    $("#routeReason_id").prop("required","true");
  }
  else {
    $("#routeReasonID").hide();
    $('#routeReason_id').val("");
    $("#routeReason_id").removeAttr("required");
  }
}
function judgelength() {
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}