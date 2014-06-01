<?php
	
	if(!$_POST['username'] || !$_POST['password']){
		$return = array('Misssing Fields');
		echo json_encode($return);
		exit;
	}
	$username = $_POST['username'];
	$password = $_POST['password'];
	
	$postdata = http_build_query(array('name' => $username, 'password' => $password));

	$opts = array('http' =>
		array(
			'method'  => 'POST',
			'header'  => 'Content-type: application/x-www-form-urlencoded',
			'content' => $postdata
			)
		);

	$context  = stream_context_create($opts);

	$response = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/user', false, $context);

	$return = array("ok");  

	echo json_encode($return);

?>