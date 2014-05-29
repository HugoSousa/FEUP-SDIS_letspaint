<?php
	session_set_cookie_params(3600); //FIXME
  	session_start();

	//se for o ultimo membro da sala, apaga-la da DB
	$response = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/user?roomName='. $_SESSION['room_name']);

	$json = json_decode($response, true);
	
	var_dump( $json);

	if(count($json) == 1){
		//fazer delete da room
		$request = new HttpRequest('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/room/'. $_SESSION['room_id'], HttpRequest::METH_DELETE);
		$request->send();
	}


	unset($_SESSION['room_id']);
	unset($_SESSION['room_name']);
	header('Location: ../pages/user_page.php');
?>