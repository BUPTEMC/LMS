function change(ename,newEquipment,innerMember,newPerson){ 
  var pushename = ename.split(",");
  var pushnewEquipment = newEquipment.split(",");
  var pushinnerMember = innerMember.split(",");
  var pushenewPerson = newPerson.split(",");
  var name = "";
  var pushmember = "";
  var ename = "";
  var member = "";
  for(i = 0; i < pushename.length; i++){
    if (pushename[i] !== "") {
      name += "<label class='form-label'>" + pushename[i] + "</label>";
      ename += pushename[i] + ",";
    }
  }
  for(i = 0; i < pushnewEquipment.length; i++){
    if (pushnewEquipment[i] !== "") {
      name += "<label class='form-label'>" + pushnewEquipment[i] + "</label>";
      ename += pushnewEquipment[i] + ",";
   } 
  }
  for(i = 0; i < pushinnerMember.length; i++){
    if (pushinnerMember[i] !== "") {
      pushmember += "<label class='form-label'>" + pushinnerMember[i] + "</label>";
      member += pushinnerMember[i] + ",";
   } 
  }
  for(i = 0; i < pushenewPerson.length; i++){
    if (pushenewPerson[i] !== "") {
      pushmember += "<label class='form-label'>" + pushenewPerson[i] + "</label>";
      member += pushenewPerson[i] + ",";
   } 
  }
  ename = ename.substring(0,ename.length-1);
  member = member.substring(0,member.length-1);
  $("#equipment_tbody").empty();
  $("#eqname").hide();
  $("#eqname").val(ename);
  $("#member_tbody").empty();
  $("#allmember").hide();
  $("#allmember").val(member);
  document.getElementById("equipment_tbody").insertAdjacentHTML("beforeEnd",name);
  document.getElementById("member_tbody").insertAdjacentHTML("beforeEnd",pushmember);
}
function judgelength() {
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}