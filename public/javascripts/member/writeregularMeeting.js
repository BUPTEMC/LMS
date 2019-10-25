// 获取人员姓名
// function getName(str) {
//   var xmlhttp, obj, obj_str;
//   if (window.XMLHttpRequest) {
//     // code for IE7+, Firefox, Chrome, Opera, Safari
//     xmlhttp = new XMLHttpRequest();
//   }
//   else {
//     // code for IE6, IE5
//     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//   }
//   xmlhttp.onreadystatechange = function() {
//     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//       obj_str = xmlhttp.responseText;
//       obj_str = obj_str.replace(/userName/g,"label");
//       obj_str = obj_str.replace(/name/g,"label");
//       obj = eval("(" + obj_str + ")");
//       // var part_1 = "";
//       // for (var i = 0; i < obj.length; i++) {
//       //   part_1 += "<option>" + obj[i].userName + "</option>";
//       // }
//       // var add = "" + part_1;
//       // document.getElementById("select_items").insertAdjacentHTML("beforeEnd",add);
//       searchbox(obj);
//     }
//   }
//   xmlhttp.open("get","/homePage/checkName2?name="+str,true);
//   xmlhttp.send();
// }
function getName(str) {
  if (str !== "") {
      $.ajax({
        type : 'POST',
        url : '/homePage/checkName2?name=' + str,
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false
    }).done(function(data){
        var obj;
        var obj_str = JSON.stringify(data);;
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
    }).fail(function(err){
        console.error(err);
    });
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
    xmlhttp.open("GET","/homePage/clearName2?name="+str,true);
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
function judgelength() {
  var temp = $('#project').val();
  if(temp !== "") {
    clearName(temp);
  }
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}