function change1(result) {
  if (result == "不合格") {
    $("#1_reason").show();
    $('#1_content').val("");
    $("#1_content").prop("required","true");
    $('#1_correctRecord').val("");
    $("#1_correctRecord").prop("required","true");
  }
  else {
    $("#1_reason").hide();
    $('#1_content').val("");
    $("#1_content").removeAttr("required");
    $('#1_correctRecord').val("");
    $("#1_correctRecord").removeAttr("required");
  }
}
function change2(result) {
  if (result == "不合格") {
    $("#2_reason").show();
    $('#2_content').val("");
    $("#2_content").prop("required","true");
    $('#2_correctRecord').val("");
    $("#2_correctRecord").prop("required","true");
  }
  else {
    $("#2_reason").hide();
    $('#2_content').val("");
    $("#2_content").removeAttr("required");
    $('#2_correctRecord').val("");
    $("#2_correctRecord").removeAttr("required");
  }
}
function change3(result) {
  if (result == "不合格") {
    $("#3_reason").show();
    $('#3_content').val("");
    $("#3_content").prop("required","true");
    $('#3_correctRecord').val("");
    $("#3_correctRecord").prop("required","true");
  }
  else {
    $("#3_reason").hide();
    $('#3_content').val("");
    $("#3_content").removeAttr("required");
    $('#3_correctRecord').val("");
    $("#3_correctRecord").removeAttr("required");
  }
}
function change4(result) {
  if (result == "不合格") {
    $("#4_reason").show();
    $('#4_content').val("");
    $("#4_content").prop("required","true");
    $('#4_correctRecord').val("");
    $("#4_correctRecord").prop("required","true");
  }
  else {
    $("#4_reason").hide();
    $('#4_content').val("");
    $("#4_content").removeAttr("required");
    $('#4_correctRecord').val("");
    $("#4_correctRecord").removeAttr("required");
  }
}
function change5(result) {
  if (result == "不合格") {
    $("#5_reason").show();
    $('#5_content').val("");
    $("#5_content").prop("required","true");
    $('#5_correctRecord').val("");
    $("#5_correctRecord").prop("required","true");
  }
  else {
    $("#5_reason").hide();
    $('#5_content').val("");
    $("#5_content").removeAttr("required");
    $('#5_correctRecord').val("");
    $("#5_correctRecord").removeAttr("required");
  }
}
function change6(result) {
  if (result == "不合格") {
    $("#6_reason").show();
    $('#6_content').val("");
    $("#6_content").prop("required","true");
    $('#6_correctRecord').val("");
    $("#6_correctRecord").prop("required","true");
  }
  else {
    $("#6_reason").hide();
    $('#6_content').val("");
    $("#6_content").removeAttr("required");
    $('#6_correctRecord').val("");
    $("#6_correctRecord").removeAttr("required");
  }
}
function judgelength() {
  var checkbox = document.getElementsByName('superviseMan');
  var num = 0;
  for (var i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked == true) {
      num++;
    }  
  }
  if (num < 1) {
    alert("请勾选监督员");
    return false;
  }
  var gnl = confirm("确定要提交?");
  if (gnl == true){
    return true;
  } else {
    return false;
  }
}