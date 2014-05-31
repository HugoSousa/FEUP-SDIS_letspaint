<?php
    session_set_cookie_params(3600); //FIXME
    session_start();

    if(!isset($_SESSION['username']))
      header('Location: ../pages/home.php');

?>

<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Let's Paint</title>

    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="../css/jumbotron-narrow.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy this line! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="container">
      <div class="header">
        <ul class="nav nav-pills pull-right">
          <li><a href="./gallery.php">Gallery</a></li>
          <li><a href="../actions/logout.php">Logout</a></li>
        </ul>
        <h3 class="text-muted">Let's Paint!</h3>
      </div>

      <h3 style="text-align:center">Welcome, <?php echo $_SESSION['username']; ?>!</h3>

      <div class="jumbotron">
        <h1>Let's Paint!</h1>
        <p class="lead">Join your friends and draw!</p>
        <p class="lead">If the room you want to join doesn't exist, a new one will be created, so you can invite your friends and have some fun!</p>
        <form class="form-horizontal" action="../actions/join_room.php" method="POST">
          <div class="form-group">
            <input name="room" type="text" class="form-control" placeholder="Room Name" style="text-align:center">
            <br>
            <button type="submit" class="btn btn-lg btn-primary">Join Room</a>
          </div>
        </form>
      </div>



    </div> <!-- /container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
  </body>
</html>
