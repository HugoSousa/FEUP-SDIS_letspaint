<?php
	session_set_cookie_params(3600); //FIXME
  	session_start();

	if(!$_POST['room']){
		header('Location: ../pages/user_page.php');
		exit;
	}

	$room = $_POST['room'];

	$room = str_replace(' ', '%20', $room);
	
	$response = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/room/'.$room);

	if($response == 'false'){
		header('Location: ../pages/user_page.php');
		exit;
	}

	$json = json_decode($response, true);

	print_r ($json);
	$_SESSION['room_id'] = $json['id'];

	header('Location: ../pages/paint.php');
?>