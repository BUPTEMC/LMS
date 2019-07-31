function minus(Obj) {
  Obj.parentNode.parentNode.parentNode.removeChild(Obj.parentNode.parentNode);
}
function add2(conditionContent) {
	var part_0 = "<div class='form-group'>"
	var part_1 = "<div class='col-3'></div>";
	var part_2 = "<div class='col-2'><select class='form-select' name='condition'><option value='气候条件'>气候条件</option><option value='测量高度'>测量高度</option><option value='测量温度'>测量温度</option><option value='测量湿度'>测量湿度</option></select></div>";
	var part_3 = "<div class='col-1'></div>"
	var part_4 = "<div class='col-4'><textarea class='form-input' rows='3' placeholder='" + conditionContent + "' name='conditionContent' required='required'></textarea></div><div class='col-1'></div><div class='col-1'><button type='button' onclick='minus(this)' class='btn btn-primary btn-action'><i class='icon icon-minus'></i></button></div></div>";
	var add = "" +part_0 + part_1 + part_2 + part_3 + part_4;
    document.getElementById("plus2").insertAdjacentHTML("beforeEnd",add);
}
function shownew(str) {
	if (str == "是") {
		$("#plus4").show();
    $('#newequipmentName').val("");
    $("#newequipmentName").prop("required","true");
	}
	else {
    $("#plus4").hide();
    $('#newequipmentName').val("");
    $("#newequipmentName").removeAttr("required");
  }
}
function showperson(str) {
  if (str == "是") {
    $("#plus5").show();
    $('#newpersonName').val("");
    $("#newpersonName").prop("required","true");
  }
  else {
    $("#plus5").hide();
    $('#newpersonName').val("");
    $("#newpersonName").removeAttr("required");
  }
}
function change() {
  $("#plus4").hide();
  $("#plus5").hide();
}
function clearName(str) {
  var xmlhttp, flag; //flag = 1表示未查到
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      flag = xmlhttp.responseText;
      if(flag == "yes") {
        $("#projectName").val("");
        alert("项目名称已存在");
      }
    }
  }
  xmlhttp.open("GET","/homePage/clearproject?name="+str,true);
  xmlhttp.send();
}