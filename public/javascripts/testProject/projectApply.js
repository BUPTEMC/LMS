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
function addnewEq() {
  var part_0 = "<div class='form-group'>"
  var part_1 = "<div class='col-6'></div>";
  var part_2 = "<div class='col-4'><input class='form-input' name='newEquipment' id='newequipmentName' placeholder='新设备名称' required='required'></div>";
  var part_3 = "<div class='col-1'></div>"
  var part_4 = "<div class='col-1'><button type='button' onclick='minus(this)' class='btn btn-primary btn-action'><i class='icon icon-minus'></i></button></div></div>";
  var add = "" + part_0 + part_1 + part_2 + part_3 + part_4;
    document.getElementById("plus7").insertAdjacentHTML("beforeEnd",add);
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
    $("#plus7").empty();
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
function judgelength() {
  var checkbox = document.getElementsByName('ename');
  var checkbox2 = document.getElementsByName('innerMember');
  var checkbox3 = $('#newequipmentName').val();
  var num = 0;
  var num1 = 0;
  var num2 = 0;
  var num3 = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num1++;
    }  
  }
  for (var i = 0; i < checkbox2.length; i++) {
    if (checkbox2[i].checked == true) {
      num2++;
    }  
  }  if (checkbox3 !== "") {
    num3++;
  }
  num = num1 + num3;
  if (num < 1) {
    alert("请勾选设备或输入新设备");
    return false;
  }
  if (num2 < 1) {
    alert("请勾选内部人员");
    return false;
  }
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
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