function push(conditions,conditionContent,equipment1,equipment2,person){
  var condition = conditions.split(",");
  var conditioncontent = conditionContent.split(",");
  var name = "";
  if (condition.length == 1) {
    name += "<div class='form-group'><div class='col-3'><label class='form-label'>环境条件</label></div><div class='col-3'><label class='form-label'>" + condition[0] + "</label></div><div class='col-6'><textarea class='form-input' rows='3' readonly='readonly'>" + conditioncontent[0] + "</textarea></div></div>"
  }
  else {
      name += "<div class='form-group'><div class='col-3'><label class='form-label'>环境条件</label></div><div class='col-3'><label class='form-label'>" + condition[0] + "</label></div><div class='col-6'><textarea class='form-input' rows='3' readonly='readonly'>" + conditioncontent[0] + "</textarea></div></div>"
      for(var i = 1; i < condition.length; i++){
      name += "<div class='form-group'><div class='col-3'><label class='form-label'></label></div><div class='col-3'><label class='form-label'>" + condition[i] + "</label></div><div class='col-6'><textarea class='form-input' rows='3' readonly='readonly'>" + conditioncontent[i] + "</textarea></div></div>"
    }
  } 
  document.getElementById("star").insertAdjacentHTML("afterEnd",name);
  if (equipment1 == "") {
    $("#equipment1").hide();
  }
  if (equipment2 == "") {
    $("#equipment2").hide();
  }
  if (person == "") {
    $("#person").hide();
  }
}