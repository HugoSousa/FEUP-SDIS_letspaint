$(function() {

	$( "#register" )
	.button()
	.click(function() {
		if (document.getElementById("register-form").checkValidity()) {

			var username = $('#inputUsername').val();
			var password = $('#inputPassword').val();

			jQuery.ajax({ 
				type: "POST", 
				url: "../actions/register.php", 
				data: { username: username, password: password},
				cache: false, 
				async: false, 
				dataType: "json",
				success: function(data) 
				{
					if(data == 'ok'){
						alert('Register Complete Please Login!');
					}else{
						alert($data);
					}
				},
				error: function(xhr, textStatus, errorThrown){
					alert("User Already Exists!");
				}

			});

		}});
});
