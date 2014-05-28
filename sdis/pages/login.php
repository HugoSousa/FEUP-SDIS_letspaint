<?php
	session_set_cookie_params(3600); //FIXME
  	session_start();

	if(!$_POST['username'] || !$_POST['password']){
		header('Location: ./home.php');
		exit;
	} 

	$username = $_POST['username'];
	$password = $_POST['password'];

	$response = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/user?login='. $username);

	$json = json_decode($response, true);
	
	if($password == $json['password']){
		$_SESSION['username'] = $username; 

		header('Location: ../index.php');
	}
	else
		header('Location: ./home.php');



?>