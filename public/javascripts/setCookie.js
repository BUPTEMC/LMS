function setCookie(){   
	var c_name = 'username';
  	var c_password = 'password';
  	var value_name = document.forms["users"].id.value;
  	var value_password = document.forms["users"].password.value;
  	// 在cookie中存储md5加密后的密码
  	var password_alter = md5(value_password);
  	document.cookie=c_name+ "=" +escape(value_name);
  	document.cookie=c_password+ "=" +escape(password_alter);
}