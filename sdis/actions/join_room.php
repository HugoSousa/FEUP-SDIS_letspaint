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
		//criar sala 
		$postdata = http_build_query(array('name' => $_POST['room']));

		$opts = array('http' =>
		    array(
		        'method'  => 'POST',
		        'header'  => 'Content-type: application/x-www-form-urlencoded',
		        'content' => $postdata
		    )
		);

		$context  = stream_context_create($opts);

		$response2 = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/room', false, $context);
		//print_r($result);

		if($response2 == 'false')
   			exit;

   		$json = json_decode($response2, true);
   		$_SESSION['room_id'] = $json['id'];
		$_SESSION['room_name'] = $_POST['room'];
		header('Location: ../pages/paint.php');

		exit;
	}

	$json = json_decode($response, true);

	//print_r ($json);
	$_SESSION['room_id'] = $json['id'];
	$_SESSION['room_name'] = $_POST['room'];

	header('Location: ../pages/paint.php');
?>