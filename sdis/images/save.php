<?php

	$data = substr($_POST['imageData'], strpos($_POST['imageData'], ",") + 1);
	$decodedData = base64_decode($data);

	//buscar id do utilizador que gravou a imagem a $_SESSION
	$now = new DateTime();
	$filename = "USERID" . $now->format("Ymdhis").".png";
	$fp = fopen($filename, 'wb');
	fwrite($fp, $decodedData);
	fclose($fp);
	echo $filename;
?>