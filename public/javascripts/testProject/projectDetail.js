function conditions(Condition,Content){
  var condition = Condition.split(",");
  var content = Content.split(",");
  var name = "";
  for(var i = 0; i < condition.length; i++){
    name += "<tr><td>" + condition[i] + "</td><td>" + content[i] + "</td></tr>"
  }
  document.getElementById("accessorys_tbody").insertAdjacentHTML("beforeEnd",name);
}
function sources(ename,innerMember,newEquipment,newPerson,price){
  var name = "";
  if (ename !== "") {
    name += "<tr><td>已有设备</td><td>" + ename + "</td></tr>"
  }
  if (innerMember !== "") {
    name += "<tr><td>内部人员</td><td>" + innerMember + "</td></tr>"
  }
  if (newEquipment !== "") {
    name += "<tr><td>新设备</td><td>" + newEquipment + "</td></tr>"
  }
  if (newPerson !== "") {
    name += "<tr><td>外部人员</td><td>" + newPerson + "</td></tr>"
  }
  if (price !== "") {
    name += "<tr><td>资金</td><td>" + price + "</td></tr>"
  }
  document.getElementById("accuracy_tbody").insertAdjacentHTML("beforeEnd",name);
}