<?php
	session_set_cookie_params(3600); //FIXME
  	session_start();

  	unset($_SESSION['username']);
  	unset($_SESSION['user_id']);
  	unset($_SESSION['room_id']);

  	header('Location: ../pages/home.php');


?>