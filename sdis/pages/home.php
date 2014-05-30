
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="../../assets/ico/favicon.ico">

    <title>Let's Paint</title>

    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
  
  </head>

  <body>
    <div class="navbar navbar-inverse">

      <div class="container">
        <a href="" class="navbar-brand">Let's Paint!</a>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">Log in <b class="caret"></b></a>  
            <div class="dropdown-menu" style="padding: 15px; width:200px">
              <form class="form" action="../actions/login.php" method="post">
                <input name="username" type="text" placeholder="Username" size="30" style="margin-bottom: 15px;" class="form-control"> 
                <input name="password" type="password" placeholder="Password" size="30" style="margin-bottom: 15px;" class="form-control"><br>
                <input class="btn btn-primary" style="clear: left; width: 100%; height: 32px; font-size: 13px" type="submit" value="Sign In" />
              </form>
            </div>
          </li>
      </div>

    </div>

    <br><br>
    
    <div class="container">
      <div class="jumbotron">
        <h1>Let's Paint!</h1>
        <p><i>Let's Paint!</i> is a free to use online whiteboard based painting & drawing tool. 
          It makes it easy to draw online free with multiple people for fun or business. 
          You can have several people in a room and the drawing updates in real time. 
          Uses different colors, shapes and text.</p>
          <br><br>
          <p style="text-align:center">You aren't registed yet? What are you waiting for?!</p>
          <p style="text-align:center"><a class="btn btn-primary btn-lg" href="#">Register</a></p>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/docs.min.js"></script>
  </body>
</html>
