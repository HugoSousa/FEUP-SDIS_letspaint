<?php
    session_set_cookie_params(3600); //FIXME
    session_start();
    
    if(!isset($_SESSION['username']))
      header('Location: ../pages/home.php');
    else if(!isset($_SESSION['room_id'])){
      header('Location: ../pages/user_page.php');
    }
    

    $username = $_SESSION['username'];
    $user_id = $_SESSION['user_id'];
    $room_id = $_SESSION['room_id'];
    $room_name = $_SESSION['room_name'];

    $data = array('user' => $user_id, 'room' => $room_id);
    $response = http_put_data ('http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/user', json_encode($data));

?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
	    <title>Collaborative Paint</title>
        <link rel="stylesheet" type="text/css" href="../css/style.css">
        <link rel="stylesheet" href="../css/jquery-ui-1.10.4.custom.min.css" />
        <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
        <script src="//code.jquery.com/jquery-1.10.2.js"></script>
        <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <script>
            $(function() {
                $( "#radio" ).buttonset();
                $( "button" ).button();
                $( "#dialog" ).dialog({
                  autoOpen: false,
                  show: {
                    effect: "blind",
                    duration: 1000
                  },
                  width: 1000
                });
                $( "#save" ).click(function() {
                  console.log("abrir dialog");
                  $( "#dialog" ).dialog( "open" );
                });
                $( "#slider" ).slider({
                    value: 9,
                    min: 1,
                    max: 25
                });

                $( "#red, #green, #blue" ).slider({
                    orientation: "horizontal",
                    range: "min",
                    max: 255,
                    value: 127,
                    slide: refreshSwatch,
                    change: refreshSwatch
                });

                $( "#red" ).slider( "value", 0 );
                $( "#green" ).slider( "value", 0 );
                $( "#blue" ).slider( "value", 0 );

                function refreshSwatch() {
                    var red = $( "#red" ).slider( "value" ),
                    green = $( "#green" ).slider( "value" ),
                    blue = $( "#blue" ).slider( "value" ),
                    hex = hexFromRGB( red, green, blue );

                    $( "#swatch" ).css( "background-color", "#" + hex );
                }

                function hexFromRGB(r, g, b) {
                    var hex = [
                      r.toString( 16 ),
                      g.toString( 16 ),
                      b.toString( 16 )
                    ];
                    $.each( hex, function( nr, val ) {
                      if ( val.length === 1 ) {
                        hex[ nr ] = "0" + val;
                      }
                    });
                    return hex.join( "" ).toUpperCase();
                }
            });
        </script>
        <link type="text/css" href="../css/jquery.ui.chatbox.css" rel="stylesheet" />
        <script type="text/javascript" src="../js/jquery.ui.chatbox.js"></script>
  	</head>
  	<body>
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1482504908633046',
          xfbml      : true,
          version    : 'v2.0'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    </script>

    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

<h1 id="header"> Let's Paint! </h1>
<h3 id="room_name"><?php echo str_replace('%20', ' ', $room_name); ?></h3>
<br>


<div id="tools">
    <form>
      <div id="radio">
        <input type="radio" id="brush" name="radio" checked="checked"><label for="brush">Brush</label>
        <input type="radio" id="spray" name="radio"><label for="spray">Spray</label>
        <input type="radio" id="rectangle" name="radio"><label for="rectangle">Rectangle</label>
        <input type="radio" id="circle" name="radio"><label for="circle">Circle</label>
        <input type="radio" id="line" name="radio"><label for="line">Line</label>
        <input type="radio" id="addtext" name="radio"><label for="addtext">Text</label>
        <input type="radio" id="eraser" name="radio"><label for="eraser">Eraser</label>
      </div>
      
    </form>
    <form action="../actions/leave_room.php">
      <button id="leave">Leave Room</button>
    </form>
    <button id="save">Save</button>   
</div>


<div id="sketch">
    <canvas id="board" ></canvas>

    <div id="slider-wrapper"> 
        <p class="ui-state-default ui-corner-all ui-helper-clearfix">Line Width</p>
        <div id="slider"></div>
    </div>


    <!-- COLOR PICKER -->
    <div id="color-wrapper">
        <div id="red"></div>
        <div id="green"></div>
        <div id="blue"></div>
        <div id="swatch" class="ui-widget-content ui-corner-all"></div>
    </div>

</div>

<div id="dialog" title="Save Image" style="text-align:center">
    <p>This drawing was saved on the gallery.</p>
    <p>Do you also want to share this drawing on Facebook?</p>
    <div id="fb-share" data-href="http://google.com" class="fb-share-button" data-width="30" data-type="button" style="margin: 0 auto !important;"></div>
</div>

<br><br>
<div id="people"> <h3>People in this room:</h3> 
</div>

<div id="chat_div"> </div>
  
    <script>var username = '<?php echo $username; ?>';</script>
    <script>var user_id = '<?php echo $user_id; ?>';</script>
    <script>var room_id = '<?php echo $room_id; ?>';</script>
    <script>var room_name = '<?php echo $room_name; ?>';</script>
    <script src="../js/paint.js"></script>
	</body>
</html>