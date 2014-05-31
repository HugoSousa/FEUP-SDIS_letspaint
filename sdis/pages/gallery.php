<?php
  session_set_cookie_params(3600); //FIXME
  session_start();

   if(!isset($_SESSION['username']))
    header('Location: ../pages/home.php');
  
  $response = file_get_contents('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/gallery');

  $images = json_decode($response, true);

  if(! isset($_GET['page']))
    $page = 0;
  else{
    $page = $_GET['page'] - 1;
    if ($page < 0 ) {
      $page = 0;
    }
  }

  $up = $page + 2;
  $down = $page;

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"> 
        <meta charset="utf-8">
        <title>Let's Paint! Gallery</title>
        <meta name="generator" content="Bootply" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
        
        <!--[if lt IE 9]>
          <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <link rel="shortcut icon" href="/bootstrap/img/favicon.ico">
        <link rel="apple-touch-icon" href="/bootstrap/img/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/bootstrap/img/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/bootstrap/img/apple-touch-icon-114x114.png">

        <!-- CSS code from Bootply.com editor -->
        
        <style type="text/css">
            .modal-dialog {}

            .thumbnail {margin-bottom:6px;}

            .carousel-control.left,.carousel-control.right{
              background-image:none;
              margin-top:10%;
              width:5%;
            }
        </style>
    </head>
    
    <!-- HTML code from Bootply.com editor -->
    
    <body  >
        
  <div class="container">
  <div class="row">
    <div class="header">
        <ul class="nav nav-pills pull-right">
          <li><a href="./user_page.php">Go Back</a></li>
          <li><a href="../actions/logout.php">Logout</a></li>

        </ul>
        <h3 class="text-muted">Gallery</h3>
      </div>
      <hr>
      <br>
    <div class="row">

      <?php
        if(count($images) == 0)
          echo '<h3 style="text-align:center"> There are no saved images yet! </h3>';

        for ($i = 16 * $page; $i < count($images); $i++) {
          if ($i >= 16 * ($page+1)) {
            break;
          }
          echo '<div class="col-lg-3 col-sm-4 col-xs-6"><a href="#"><img save_date="'.$images[$i]['time'].'" user="'.$images[$i]['name'].'" class="thumbnail img-responsive" src="//paginas.fe.up.pt/~ei11083/sdis_rest/images/'.$images[$i]['url'].'""></a></div>' ;
        }
      ?>
    </div>
    <hr>

      <div>
        <?php

          if ($down <= 0) {
            echo '<a>';
          }else{
            echo '<a href="./gallery.php?page='.$down.'">';
          }
        ?>
        <img align="left" width="100" height="100" src="../images/arrow left.png"></a>
      </div>
      <div>
        <?php
          if($up > ceil(count($images)/16) ){
            echo '<a>';
          }else{
            echo '<a href="./gallery.php?page='.$up.'">';
          }
        ?>
        <img align="right" width="100" height="100" src="../images/arrow right.png"></a>
      </div>

    
  </div>
</div>

<div class="modal" id="myModal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" type="button" data-dismiss="modal">×</button>
        <h4 class="modal-title" id="user-save"></h4>
        <div id="date-save"></div>
      </div>
      <div class="modal-body">
        <div class="carousel-inner">
          <div><img id="imgModal"class="thumbnail img-responsive" src="//placehold.it/600x350"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-default" data-dismiss="modal">Close</button> 
      </div>
    </div>
  </div>
</div>


<script type='text/javascript' src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

<script type='text/javascript' src="../js/bootstrap.min.js"></script>

<!-- JavaScript jQuery code from Bootply.com editor  -->

<script type='text/javascript'>

  $(document).ready(function() {

    $('.row .thumbnail').click(function(){

      $('#imgModal').attr('src', $(this).attr('src'));
      var clicked_id = $(this).attr('id');
      $('#user-save').text('Saved by ' + $(this).attr('user'));
      $('#date-save').text($(this).attr('save_date'));
      $('#myModal').modal('show'); // show the modal

    });


  });

</script>
        
    </body>
</html>