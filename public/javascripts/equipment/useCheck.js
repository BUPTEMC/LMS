function equipmentname(eid,ename){
  var selectid = document.getElementById("eid").value;
  var i = 0;
  var flag;
  if(selectid !== "") {
    for (i = 0; i < eid.length; i++) {
      if (eid[i] == selectid) {
        flag = i;
      }
    }
    var epushname = ename[flag];
    document.getElementById('input-example-3').value = epushname;
  }
  else {
    window.history.back();
  } 
}
function add(name,telephone,organization) {
  var part_0 = "<div class='form-group'>";
  var part_1 = "<div class='col-3'>外部人员</div>";
  var part_2 = "";
  var part_3 = "<div class='col-3'><label class='form-label'>姓名</label></div>";
  var part_4 = "<div class='col-6'><input class='form-input' placeholder='姓名' name='member' required='required' id='contactsname'></div></div>";
  var part_5 = "<div class='form-group'><div class='col-3'></div><div class='col-3'><label class='form-label'>联系方式</label></div>";
  var part_6 = "<div class='col-6'><input class='form-input' placeholder='联系方式' name='telephone' required='required' id='contactstele' type='tel'></div></div>";
  var part_7 = "<div class='form-group'><div class='col-3'></div><div class='col-3'><label class='form-label'>所属单位</label></div>";
  var part_8 = "<div class='col-6'><input class='form-input' placeholder='所属单位' name='organization' required='required' id='contactsorga'></div></div>";
  var add = "" +part_0 + part_1 + part_2 + part_3 + part_4 + part_5 + part_6 + part_7 + part_8;
  $("#flag").toggle();
  $("#project").attr("name","others");
  $("#project").removeAttr("required");
  document.getElementById("plus").insertAdjacentHTML("beforeEnd",add);
  document.getElementById('addButton').onclick = function() {};
  document.getElementById('minusButton').onclick = function() { minus();};
}
function minus(name,telephone,organization) {
  var parent = document.getElementById("plus");
  var child = parent.lastChild;
  child.parentNode.removeChild(child);
  var parent = document.getElementById("plus");
  var child = parent.lastChild;
  child.parentNode.removeChild(child);
  var parent = document.getElementById("plus");
  var child = parent.lastChild;
  child.parentNode.removeChild(child);
  $("#flag").toggle();
  $("#project").attr("name","member");
  document.getElementById('addButton').onclick =  function() { add();};
  document.getElementById('minusButton').onclick = function() {};
}
//当前日期日期
// function today() {
//   // 给input  date设置默认值
//   var now = new Date();
//   //格式化日，如果小于9，前面补0
//   var day = ("0" + now.getDate()).slice(-2);
//   //格式化月，如果小于9，前面补0
//   var month = ("0" + (now.getMonth() + 1)).slice(-2);
//   //拼装完整日期格式
//   var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
//   //完成赋值
//   document.getElementById('input-example-1').value = today;
// }
// 获取人员姓名
function getName(str) {
  if(str !== "") {
    var xmlhttp, obj, obj_str;
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
        obj_str = obj_str.replace(/userName/g,"label");
        obj_str = obj_str.replace(/name/g,"label");
        obj = eval("(" + obj_str + ")");
        // var part_1 = "";
        // for (var i = 0; i < obj.length; i++) {
        //   part_1 += "<option>" + obj[i].userName + "</option>";
        // }
        // var add = "" + part_1;
        // document.getElementById("select_items").insertAdjacentHTML("beforeEnd",add);
        searchbox(obj);
      }
    }
    xmlhttp.open("GET","/homePage/checkName?name="+str,true);
    xmlhttp.send();
  }  
}
function clearName(str) {
  if (str !== "") {
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
        if(flag == "no") {
          $("#project").val("")
        }
      }
    }
    xmlhttp.open("GET","/homePage/clearName?name="+str,true);
    xmlhttp.send();
  } 
}
// 模糊查询列表
function searchbox(obj) {
  $(function(){
    $( "#project" ).autocomplete({
      minLength: 0,
      source: obj,
      focus: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
          return false;
        },
      select: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
      }
    })
  })
}