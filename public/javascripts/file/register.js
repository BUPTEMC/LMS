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
function getName2(str) {
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
        searchbox2(obj); 
    }).fail(function(err){
        console.error(err);
    });
  }  
}
function clearName(str) {
  if (str !== "") {
    var page = "/homePage/clearName2?name=" + str;
     $.ajax({
        type : 'POST',
        url : page,
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false
    }).done(function(data){
        if(data.errCode == 0) {
          $("#p1").val("");
        } 
    }).fail(function(err){
        console.error(err);
    });
  //   var xmlhttp, flag; //flag = 1表示未查到
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
  //       flag = xmlhttp.responseText;
  //       if(flag == "no") {
  //         $("#p1").val("");
  //       }
  //     }
  //   }
  //   xmlhttp.open("GET","/homePage/clearName2?name="+str,true);
  //   xmlhttp.send();
  }
}
function clearName2(str) {
  if (str !== "") {
    var page = "/homePage/clearName2?name=" + str;
     $.ajax({
        type : 'POST',
        url : page,
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false
    }).done(function(data){
        if(data.errCode == 0) {
          $("#p2").val("");
        }  
    }).fail(function(err){
        console.error(err);
    });
    // var xmlhttp, flag; //flag = 1表示未查到
    // if (window.XMLHttpRequest) {
    //   // code for IE7+, Firefox, Chrome, Opera, Safari
    //   xmlhttp = new XMLHttpRequest();
    // }
    // else {
    //   // code for IE6, IE5
    //   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     flag = xmlhttp.responseText;
    //     if(flag == "no") {
    //       $("#p2").val("");
    //     }
    //   }
    // }
    // xmlhttp.open("GET","/homePage/clearName2?name="+str,true);
    // xmlhttp.send();
  }
}
function clearName3(str) {
  if (str !== "") {
    var page = "/homePage/clearName2?name=" + str;
     $.ajax({
        type : 'POST',
        url : page,
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false
    }).done(function(data){
        if(data.errCode == 0) {
          $("#p1").val("");
          isClick1 = false;
        }
    }).fail(function(err){
        console.error(err);
    });
    // var xmlhttp, flag; //flag = 1表示未查到
    // if (window.XMLHttpRequest) {
    //   // code for IE7+, Firefox, Chrome, Opera, Safari
    //   xmlhttp = new XMLHttpRequest();
    // }
    // else {
    //   // code for IE6, IE5
    //   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     flag = xmlhttp.responseText;
    //     if(flag == "no") {
    //       $("#p1").val("");
    //       isClick1 = false;
    //     }
    //   }
    // }
    // xmlhttp.open("GET","/homePage/clearName2?name="+str,true);
    // xmlhttp.send();
  }
}
function clearName4(str) {
  if (str !== "") {
    var page = "/homePage/clearName2?name=" + str;
     $.ajax({
        type : 'POST',
        url : page,
        cache : false,  //不需要缓存
        processData : false,    //不需要进行数据转换
        contentType : false
    }).done(function(data){
        if(data.errCode == 0) {
          $("#p2").val("");
          isClick2 = false;
        }
    }).fail(function(err){
        console.error(err);
    });
    // var xmlhttp, flag; //flag = 1表示未查到
    // if (window.XMLHttpRequest) {
    //   // code for IE7+, Firefox, Chrome, Opera, Safari
    //   xmlhttp = new XMLHttpRequest();
    // }
    // else {
    //   // code for IE6, IE5
    //   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     flag = xmlhttp.responseText;
    //     if(flag == "no") {
    //       $("#p2").val("");
    //       isClick2 = false;
    //     }
    //   }
    // }
    // xmlhttp.open("GET","/homePage/clearName2?name="+str,true);
    // xmlhttp.send();
  }
}
// 模糊查询列表
function searchbox(obj) {
  $(function(){
    $( "#p1" ).autocomplete({
      minLength: 0,
      source: obj,
      focus: function( event, ui ) {
        $( "#p1" ).val( ui.item.label );
          return false;
        },
      select: function( event, ui ) {
        $( "#p1" ).val( ui.item.label );
      }
    })
  })
}
function searchbox2(obj) {
  $(function(){
    $( "#p2" ).autocomplete({
      minLength: 0,
      source: obj,
      focus: function( event, ui ) {
        $( "#p2" ).val( ui.item.label );
          return false;
        },
      select: function( event, ui ) {
        $( "#p2" ).val( ui.item.label );
      }
    })
  })
}
function judgelength() {
      var temp1 = $('#p1').val();
      var temp2 = $('#p2').val();
      if(temp1 !== "") {
        clearName3(temp1);
      }
      if(temp2 !== "") {
        clearName4(temp2);
      }
      if (isClick == false) {
        alert("请上传文件");
        return false;
      }
      if (isClick1 == false) {
        isClick1 = true;
        return false;
      }
      if (isClick2 == false) {
        isClick2 = true;
        return false;
      }
      var gnl = confirm("确定要提交?");
      if (gnl == true){
        return true;
      } else {
        return false;
      }
    }