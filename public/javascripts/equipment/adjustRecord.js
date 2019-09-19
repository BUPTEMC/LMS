function equipmentinfo(eid,ename,version,manufactureNum){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  var name = "";
  for (i = 0; i < eid.length; i++) {
    if (eid[i] == selectid) {
      flag = i;
    }
  }
  var epushname = ename[flag];
  var epushversion = version[flag];
  var epushmanufactureNum = manufactureNum[flag];
  document.getElementById('input-example-2').value = epushname;
  document.getElementById('input-example-3').value = epushversion;
  document.getElementById('input-example-4').value = epushmanufactureNum;
}
function equipmentinfoON(eid,ename,version,manufactureNum){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  var name = "";
  for (i = 0; i < eid.length; i++) {
    if (eid[i] == selectid) {
      flag = i;
    }
  }
  var epushname = ename[flag];
  var epushversion = version[flag];
  var epushmanufactureNum = manufactureNum[flag];
  document.getElementById('input-example-2').value = epushname;
  document.getElementById('input-example-3').value = epushversion;
  document.getElementById('input-example-4').value = epushmanufactureNum;
  $("#plus4").hide();
  $("#plus5").hide();
  $("#plus7").hide();
  $("#plus8").hide();
  $("#plus9").hide();
}
function minus(Obj) {
  Obj.parentNode.parentNode.parentNode.removeChild(Obj.parentNode.parentNode);
}
function add2() {
  var part_0 = "<div class='form-group'>"
  var part_1 = "<div class='col-5'></div>";
  var part_2 = "<div class='col-2'><select class='form-select' name='accuracyItem'><option value='量程'>量程</option><option value='频率范围'>频率范围</option><option value='最小刻度'>最小刻度</option><option value='最大误差'>最大误差</option></select></div>";
  var part_3 = "<div class='col-1'></div>"
  var part_4 = "<div class='col-2'><input class='form-input' placeholder='0.2 -1v/m' name='accuracyRange' required='required'></div><div class='col-1'></div><div class='col-1'><button type='button' onclick='minus(this)' class='btn btn-primary btn-action'><i class='icon icon-minus'></i></button></div></div>";
  var add = "" +part_0 + part_1 + part_2 + part_3 + part_4;
    document.getElementById("plus2").insertAdjacentHTML("beforeEnd",add);
}
function add3() {
  $("#plus4").toggle();
  $("#plus5").toggle();
  $("#reason").prop("required","true");
  $("#state").prop("required","true");
  $("#input-example-7").removeAttr("readonly");
}
function getadjustPlan(id,password,name) {
  var xmlhttp, obj, obj_str, str, page;
  str = $('#eid').val();
  page = "/homePage/adjust?id=" + id + "&password=" + password + "&name=" + name; 
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
      obj_str = xmlhttp.responseText;
      if(obj_str == "no") {
        window.location.href = page;
      }
      else {
        obj = eval("(" + obj_str + ")");
        $("#input-example-5").val(obj.adjustTime);
        $("#input-example-8").val(obj.period);
        $("#input-example-9").val(obj.adjustOrganization);
        var adjustitem = obj.adjustItem.split(",");
        var name = "";
        for (var i = 0; i < adjustitem.length; i++) {
          name += "<div class='form-group'><div class='col-3'><label class='form-label' for='input-example-11'>不确定度</label></div>";
          name += "<div class='col-3'><input class='form-input' id='aItem' name='adjustItem' readonly='readonly' value='" + adjustitem[i] + "'></div>";
          name += "<div class='col-1'></div><div class='col-5'><input class='form-input' id='input-example-11' name='uncertainty' required='required' placeholder='10M-1G为1.0,1G-6G为1.3/1.5'></div></div>";
        }
        $("#plus11").empty();
        document.getElementById("plus11").insertAdjacentHTML("beforeEnd",name);
      }
    }
  }
  xmlhttp.open("GET","/homePage/getadjustPlan?eid="+str,true);
  xmlhttp.send();
}
function adjustCheck(adjustname,upperLimit,lowerLimit) {
  var adjustItem = $('#aItem').val();
  var adjustitem = adjustItem.split(",");
  var Uncertainty = $('#input-example-11').val();
  var uncertainty = Uncertainty.split(",");
  var num = 0;
  for (var i = 0; i < adjustitem.length; i++) {
    for (var j = 0; j < adjustname.length; j++) {
      if (adjustitem[i] == adjustname[j]) {
        if (uncertainty[i] <= upperLimit[j] && uncertainty[i] >= lowerLimit[j]) {
          num++;
        }
      }
    }  
  }
  if (num == adjustitem.length) {
    $('#check').val("合格");
    return false;
  }
  else {
    $('#check').val("不合格");
    return false;
  }
}
function adjustReason(accuracyItem,accuracyRange){
  $("#adjustItem_tbody").empty();  
  document.getElementById('adjustItem').style.display='block';
  var accuracyitem = accuracyItem.split(";");
  var accuracyrange = accuracyRange.split(";");
  var name="";
  for(var i = 0; i < accuracyitem.length; i++){
      name += "<tr><td>" + accuracyitem[i] + "</td><td>" + accuracyrange[i] + "</td></tr>"
  }
  document.getElementById("adjustItem_tbody").insertAdjacentHTML("beforeEnd",name);
}
function DateAdd(interval, number, date) {
    switch (interval) {
    case "y ": {
        date.setFullYear(date.getFullYear() + number);
        return date;
        break;
    }
    case "q ": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
        break;
    }
    case "m ": {
        month = date.getMonth() + number;
        date.setMonth(month);
        return date;
        break;
    }
    case "w ": {
        date.setDate(date.getDate() + number * 7);
        return date;
        break;
    }
    case "d ": {
        date.setDate(date.getDate() + number);
        return date;
        break;
    }
    case "h ": {
        date.setHours(date.getHours() + number);
        return date;
        break;
    }
    case "m ": {
        date.setMinutes(date.getMinutes() + number);
        return date;
        break;
    }
    case "s ": {
        date.setSeconds(date.getSeconds() + number);
        return date;
        break;
    }
    default: {
        date.setDate(d.getDate() + number);
        return date;
        break;
    }
    }
}
function DateToStr(date){
     var year = date.getFullYear();
     var month =(date.getMonth() + 1).toString();
     var day = (date.getDate()).toString();
     if (month.length == 1) {
         month = "0" + month;
     }
     if (day.length == 1) {
         day = "0" + day;
     }
     dateTime = year +"-"+ month +"-"+  day;
     return dateTime;
}