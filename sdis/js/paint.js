var repaint_all = true;

setInterval(getChat, 1000);
getPaints();

getPeople();
setInterval(getPeople, 5000);

//user é o nome do user
var box = $("#chat_div").chatbox({	id:"chat_div", 
	                            user:"nome do user",
	                            title: "Chat",
	                            hidden: false,
	                            messageSent : function(id, user, msg) {
	                            	//inserir na BD
	                            	//ter como variaveis globais o id do user e do room
	                            	var data = { "message": msg, "user_id" : user_id, "room_id" : room_id};

									$.ajax({
										type: "post",
										url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/chat", 
										dataType: "json",
										contentType: "application/json",
										data: JSON.stringify(data),
										success: function(data){
										}
									});

	                                //$("#chat_div").chatbox("option", "boxManager").addMsg(username + "  " + chat_actual_time, msg);
	                            }
                        	});
  




var line_id;
var canvas = document.querySelector('#board');
var ctx = canvas.getContext('2d');
var sketch = document.querySelector('#sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));
var tool = 'brush';
var sprayIntervalID;

//EVENTS
jQuery('#tools input').on('click', function () {
	console.log('click');

	tool = jQuery(this).attr('id');
	tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
	tmp_canvas.style.display = 'block';

});

/*
jQuery('#new').on('click', function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});
*/

jQuery('#save').on('click', function () {
	console.log("click save");
	var imageURL = canvas.toDataURL();

	//pedido post para API (server). lá guardar a imagem.
	var data = { "url": imageURL, "user_id" : user_id};
	//$("#fb-share").attr('href', "http://facebook.com");


	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/gallery", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			var redirect = "http://paginas.fe.up.pt/~ei11083/sdis_rest/images/" + data['url'];
			$("#fb-share").attr('href', redirect);
			FB.XFBML.parse();
		}
	});

	/*
	$.post("images/save.php", {
		imageData : imageURL
	}, function(data) {
		//window.location = data;
		console.log(data);
		$("#fb-share").attr('data-href', "localhost/sdis/images"+data);
	});
	*/
	//console.log(imageURL);

	
	//window.location.href=image;
});

/*
jQuery('#leave').on('click', function () {

		$.ajax({
		url: "../actions/leave_room.php", 
		dataType: "json",
		contentType: "application/json",
		success: function(data){
			console.log("leave room success");
		}
	});

	//unset $_SESSION
	//header para user_page
	//se for o ultimo user na sala, eliminar da BD
});
*/


//TEMPORARY CANVAS
var tmp_canvas = document.createElement('canvas');
var tmp_ctx = tmp_canvas.getContext('2d');
tmp_canvas.id = 'tmp_canvas';
tmp_canvas.width = canvas.width;
tmp_canvas.height = canvas.height;

sketch.appendChild(tmp_canvas);
//tmp_canvas.style.display = 'none';
//tmp_ctx.clearRect(0, 0, canvas.width, canvas.height);
//tmp_canvas.style.display = 'block';


/************* for addding text ***********/
	
	var textarea = document.createElement('textarea');
	textarea.id = 'text_tool';
	sketch.appendChild(textarea);
	
	// Text tool's text container for calculating
	// lines/chars
	var tmp_txt_ctn = document.createElement('div');
	tmp_txt_ctn.style.display = 'none';
	sketch.appendChild(tmp_txt_ctn);
	
	
	textarea.addEventListener('mouseup', function(e) {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
	}, false);

/*********** end for text *********/


var mouse = {
	x: 0,
	y: 0
};
var start_mouse = {
	x: 0,
	y: 0
};
var last_mouse = {
	x: 0,
	y: 0
};

/* Mouse Capturing Work */
tmp_canvas.addEventListener('mousemove', function (e) {

	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
}, false);


/* Drawing on Paint App */
tmp_canvas.addEventListener('mousedown', function (e) {

	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

	start_mouse.x = mouse.x;
	start_mouse.y = mouse.y;

	if (tool == 'line') {
		tmp_canvas.addEventListener('mousemove', onLinePaint, false);
		onLinePaint();
	} else if (tool == 'rectangle') {
		tmp_canvas.addEventListener('mousemove', onRectPaint, false);
		onRectPaint();
	} else if (tool == 'brush') {
		tmp_canvas.addEventListener('mousemove', onBrushPaint, false);
		onBrushPaint();
	} else if (tool == 'circle') {
		tmp_canvas.addEventListener('mousemove', onCirclePaint, false);
		onCirclePaint();
	} else if (tool == 'addtext') {
		if(textarea.value == '')
			tmp_canvas.addEventListener('mousemove', onPaint, false);
		else{

			tmp_ctx.fillStyle = $('#swatch').css('background-color');
			var lines = textarea.value.split('\n');
			var processed_lines = [];
			
			for (var i = 0; i < lines.length; i++) {
				var chars = lines[i].length;
				for (var j = 0; j < chars; j++) {
					var text_node = document.createTextNode(lines[i][j]);
					tmp_txt_ctn.appendChild(text_node);
					
					// Since tmp_txt_ctn is not taking any space
					// in layout due to display: none, we gotta
					// make it take some space, while keeping it
					// hidden/invisible and then get dimensions
					tmp_txt_ctn.style.position   = 'absolute';
					tmp_txt_ctn.style.visibility = 'hidden';
					tmp_txt_ctn.style.display    = 'block';
					
					var width = tmp_txt_ctn.offsetWidth;
					var height = tmp_txt_ctn.offsetHeight;
					
					tmp_txt_ctn.style.position   = '';
					tmp_txt_ctn.style.visibility = '';
					tmp_txt_ctn.style.display    = 'none';
					
					// Logix
					// console.log(width, parseInt(textarea.style.width));
					if (width > parseInt(textarea.style.width)) {
						break;
					}
				}
				
				processed_lines.push(tmp_txt_ctn.textContent);
				tmp_txt_ctn.innerHTML = '';
			}
			
			var ta_comp_style = getComputedStyle(textarea);
			var fs = ta_comp_style.getPropertyValue('font-size');
			var ff = ta_comp_style.getPropertyValue('font-family');
			
			//console.log("FONT SIZE: " + fs);
			//console.log("FONTE FAMILY " + ff);

			tmp_ctx.font = fs + ' ' + ff;
			tmp_ctx.textBaseline = 'top';
			//tmp_ctx.strokeStyle = ta_comp_style.getPropertyValue('color');
			//tmp_ctx.fillStyle = ta_comp_style.getPropertyValue('color');

			for (var n = 0; n < processed_lines.length; n++) {
				var processed_line = processed_lines[n];
				
				tmp_ctx.fillText(
					processed_line,
					parseInt(textarea.style.left),
					parseInt(textarea.style.top) + n*parseInt(fs)
				);
			}
			
			//console.log("LEFT: " + parseInt(textarea.style.left));
			//console.log("TOP: " + parseInt(textarea.style.top));
			
			//console.log("INSERT: " + textarea.value);
			//console.log("FONT SIZE: " + parseInt(fs));
			//lineWidth -> font size
			var data = { "room": room_id, "user": user_id, "type" : "text", "line_width" : parseInt(fs), "pos_x" : parseInt(textarea.style.left), "pos_y" : parseInt(textarea.style.top), "color" : tmp_ctx.fillStyle, "width" : tmp_txt_ctn.offsetWidth, "height": tmp_txt_ctn.offsetHeight, "text" : textarea.value};

			$.ajax({
				type: "post",
				url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: function(data){
				}
			});
		
			// Writing down to real canvas now
			ctx.drawImage(tmp_canvas, 0, 0);
			// Clearing tmp canvas
			tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
			
			// clearInterval(sprayIntervalID);
			textarea.style.display = 'none';
			textarea.value = '';
		}
	}
	else if(tool == 'spray'){
		tmp_canvas.addEventListener('mousemove', onSprayPaint, false);
		sprayIntervalID = setInterval(onSprayPaint, 50);
	}
	else if(tool == 'eraser'){
		tmp_canvas.addEventListener('mousemove', onErasePaint, false);
		onErasePaint();
	}

}, false);

tmp_canvas.addEventListener('mouseup', function () {
	tmp_canvas.removeEventListener('mousemove', onLinePaint, false);
	tmp_canvas.removeEventListener('mousemove', onRectPaint, false);
	tmp_canvas.removeEventListener('mousemove', onBrushPaint, false);
	tmp_canvas.removeEventListener('mousemove', onCirclePaint, false);
	tmp_canvas.removeEventListener('mousemove', onPaint, false);
	tmp_canvas.removeEventListener('mousemove', onSprayPaint, false);
	tmp_canvas.removeEventListener('mousemove', onErasePaint, false);

	if(tool == 'rectangle'){
		insertRectangle();
	}
	else if(tool == 'circle'){
		insertCircle();
	}
	else if (tool == 'line'){
		insertLine();
	}

	clearInterval(sprayIntervalID);

	// Writing down to real canvas now
	ctx.drawImage(tmp_canvas, 0, 0);
	// Clearing tmp canvas
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	ppts = [];

}, false);
/*
canvas.addEventListener('mousemove', function (e) {
	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
}, false);

canvas.addEventListener('mousedown', function (e) {
	canvas.addEventListener('mousemove', onErase, false);

	//console.log('here');

	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;

	ppts.push({
		x: mouse.x,
		y: mouse.y
	});

	onErase();
}, false);

canvas.addEventListener('mouseup', function () {
	canvas.removeEventListener('mousemove', onErase, false);

	// Emptying up Pencil Points
	ppts = [];
}, false);
*/


////////////////////////////////////////////////////////////////////////
/////////////////////////////TOOL FUNCTIONS/////////////////////////////
////////////////////////////////////////////////////////////////////////


var onPaint = function() {

	tmp_ctx.lineWidth = $('#slider').slider("value");
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.fillStyle = $('#swatch').css('background-color');
	tmp_ctx.strokeStyle = $('#swatch').css('background-color');

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	
	var x = Math.min(mouse.x, start_mouse.x);
	var y = Math.min(mouse.y, start_mouse.y);
	var width = Math.abs(mouse.x - start_mouse.x);
	var height = Math.abs(mouse.y - start_mouse.y);
	
	textarea.style.left = x + 'px';
	textarea.style.top = y + 'px';
	textarea.style.width = width + 'px';
	textarea.style.height = height + 'px';
	
	textarea.style.fontSize = parseInt($('#slider').slider("value")) + 9 + "px";
	textarea.style.color = tmp_ctx.strokeStyle;

	textarea.style.display = 'block';
};
/*
var onErase = function () {

	console.log("PPTS LENGTH: " + ppts.length);
	if(ppts.length == 1){
		//gerar novo id
		//console.log("NEW ID!");
		now = new Date();
		line_id = now.getUTCMinutes().toString() + now.getUTCSeconds().toString() + now.getUTCMilliseconds().toString();
	}

	// Saving all the points in an array
	ppts.push({
		x: mouse.x,
		y: mouse.y
	});

	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.lineWidth = $('#slider').slider("value");

	if (ppts.length < 3) {
		var b = ppts[0];
		ctx.beginPath();
		//ctx.moveTo(b.x, b.y);
		//ctx.lineTo(b.x+50, b.y+50);
		ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		ctx.fill();
		ctx.closePath();

		var data = { "room": 3, "type" : "brush", "line_width" : ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color": "ffffff", "line_id" : line_id };
		//console.log(data);
		//console.log("VAI UM PEDIDO");
		$.ajax({
			type: "post",
			url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data){
			}, 
		});

		return;
	}

	var data = { "room": 3, "type" : "brush", "line_width" : ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color": ctx.fillStyle, "line_id" : line_id };

	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log("yeeeeey");
			//console.log(data);
			//parseResponse(data);
			//alert(data);
		}, 
	});

	ctx.beginPath();
	ctx.moveTo(ppts[0].x, ppts[0].y);

	for (var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	ctx.quadraticCurveTo(
		ppts[i].x,
		ppts[i].y,
		ppts[i + 1].x,
		ppts[i + 1].y);
	ctx.stroke();

	//without this, after using erase, every tool works like erase (back to default)
	ctx.globalCompositeOperation = 'source-over';
};
*/

var onErasePaint = function () {

	if(ppts.length == 0){
		now = new Date();
		line_id = now.getUTCMinutes().toString() + now.getUTCSeconds().toString() + now.getUTCMilliseconds().toString();
	}

	ppts.push({
		x: mouse.x,
		y: mouse.y
	});
	
	
	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.lineWidth = $('#slider').slider("value");

		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		tmp_ctx.strokeStyle = "#ffffff";
		tmp_ctx.fillStyle = "#ffffff";
		tmp_ctx.beginPath();
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		//descobrir o room do utilizador
		var data = { "room": room_id, "user": user_id, "type" : "eraser", "line_width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : "#ffffff", "line_id" : line_id };
		//console.log(data);
		//console.log("VAI UM PEDIDO");
		$.ajax({
			type: "post",
			url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data){
			}, 
		});

		//console.log("b");
		return;
	}
	
	var data = { "room": room_id, "user": user_id, "type" : "eraser", "line_width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : "#ffffff", "line_id" : line_id };

	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log("yeeeeey");
			//console.log(data);
			//parseResponse(data);
			//alert(data);
		}
	});

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

	for (var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	tmp_ctx.quadraticCurveTo(
		ppts[i].x,
		ppts[i].y,
		ppts[i + 1].x,
		ppts[i + 1].y);
	tmp_ctx.stroke();
}


var onCirclePaint = function () {
	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	var x = (mouse.x + start_mouse.x) / 2;
	var y = (mouse.y + start_mouse.y) / 2;

	var radius = Math.max(
		Math.abs(mouse.x - start_mouse.x),
		Math.abs(mouse.y - start_mouse.y)) / 2;

	tmp_ctx.beginPath();
	tmp_ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	// tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
	tmp_ctx.strokeStyle = $('#swatch').css('background-color');
	tmp_ctx.lineWidth = $('#slider').slider("value");
	tmp_ctx.stroke();
	tmp_ctx.closePath();

};

var onLinePaint = function () {
	tmp_ctx.lineWidth = $('#slider').slider("value");
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = $('#swatch').css('background-color');
	tmp_ctx.fillStyle = $('#swatch').css('background-color');
	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(start_mouse.x, start_mouse.y);
	tmp_ctx.lineTo(mouse.x, mouse.y);
	tmp_ctx.stroke();
	tmp_ctx.closePath();

};

var onRectPaint = function () {
	tmp_ctx.lineWidth = $('#slider').slider("value");
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = $('#swatch').css('background-color');
	tmp_ctx.fillStyle = $('#swatch').css('background-color');

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	var x = Math.min(mouse.x, start_mouse.x);
	var y = Math.min(mouse.y, start_mouse.y);
	var width = Math.abs(mouse.x - start_mouse.x);
	var height = Math.abs(mouse.y - start_mouse.y);
	tmp_ctx.strokeRect(x, y, width, height);
};

// Pencil Points
var ppts = [];

var onBrushPaint = function () {
	//console.log("OLE");

	if(ppts.length == 0){
		//gerar novo id
		//console.log("NEW ID!");
		now = new Date();
		line_id = now.getUTCMinutes().toString() + now.getUTCSeconds().toString() + now.getUTCMilliseconds().toString();
	}
//console.log("a");
	ppts.push({
		x: mouse.x,
		y: mouse.y
	});
	
	//console.log("X: " + mouse.x + " / Y: " + mouse.y);


	//console.log(ppts);
	
	if (ppts.length < 3) {
		var b = ppts[0];
		tmp_ctx.lineWidth = $('#slider').slider("value");

		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		tmp_ctx.strokeStyle = $('#swatch').css('background-color');
		tmp_ctx.fillStyle = $('#swatch').css('background-color');
		tmp_ctx.beginPath();
		//ctx.moveTo(b.x, b.y);
		//ctx.lineTo(b.x+50, b.y+50);
		tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
		tmp_ctx.fill();
		tmp_ctx.closePath();

		//descobrir o room do utilizador
		var data = { "room": room_id, "user": user_id, "type" : "brush", "line_width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : tmp_ctx.fillStyle, "line_id" : line_id };
		//console.log(data);
		//console.log("VAI UM PEDIDO");
		$.ajax({
			type: "post",
			url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(data),
			//jsonpCallback: "parseResponse",
			cache: true,
			//timeout: 5000, 
			success: function(data){
				//console.log("yeeeeey");
				//console.log(data);
				//parseResponse(data);
				//alert(data);
			}, 
		});

		//console.log("b");
		return;
	}
	
	var data = { "room": room_id, "user": user_id, "type" : "brush", "line_width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : tmp_ctx.fillStyle, "line_id" : line_id };


	//console.log("VAI UM PEDIDO");
	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log("yeeeeey");
			//console.log(data);
			//parseResponse(data);
			//alert(data);
		}
	});

	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(ppts[0].x, ppts[0].y);

	for (var i = 1; i < ppts.length - 2; i++) {
		var c = (ppts[i].x + ppts[i + 1].x) / 2;
		var d = (ppts[i].y + ppts[i + 1].y) / 2;

		tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}

	// For the last 2 points
	tmp_ctx.quadraticCurveTo(
		ppts[i].x,
		ppts[i].y,
		ppts[i + 1].x,
		ppts[i + 1].y);
	tmp_ctx.stroke();
};   

var onSprayPaint = function(){

	tmp_ctx.lineWidth = $('#slider').slider("value");
	tmp_ctx.fillStyle = $('#swatch').css('background-color');

	var x = mouse.x;
	var y = mouse.y;
	
	var data = { "room": room_id, "user": user_id, "type" : "spray", "line_width" : tmp_ctx.lineWidth, "pos_x" : x, "pos_y" : y, "color" : tmp_ctx.fillStyle};

	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log(data);
		}
	});

	generateSprayParticles();
} 

var getRandomOffset = function(radius) {
	var random_angle = Math.random() * (2*Math.PI);
	var random_radius = Math.random() * radius;
	
	// console.log(random_angle, random_radius, Math.cos(random_angle), Math.sin(random_angle));
	
	return {
		x: Math.cos(random_angle) * random_radius,
		y: Math.sin(random_angle) * random_radius
	};
};

var generateSprayParticles = function() {
	// Particle count, or, density
	var spray_width = tmp_ctx.lineWidth/1.7
	var density = spray_width * 5;
	
	for (var i = 0; i < density; i++) {
		var offset = getRandomOffset(spray_width);
		
		var x = mouse.x + offset.x;
		var y = mouse.y + offset.y;
		
		tmp_ctx.fillRect(x, y, 1, 1);
	}
};


////////////////////////////////////////////////////////////////
//////////////////////////GET REQUESTS//////////////////////////
////////////////////////////////////////////////////////////////


var last_time;
var actual_time;

function updateTime(){

	var now = new Date(); 
	var month = now.getUTCMonth()+1;
	if(month < 10)
		month = '0' + month;
	var day = now.getUTCDate();
	if(day < 10)
		day = '0' + day;
	var hours = now.getUTCHours();
	if(hours < 10)
		hours = '0' + hours;
	var minutes = now.getUTCMinutes();
	if(minutes < 10)
		minutes = '0' + minutes;
	var seconds = now.getUTCSeconds();
	if(seconds < 10)
		seconds = '0' + seconds;

	actual_time = now.getUTCFullYear().toString() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + now.getUTCMilliseconds().toString();

	if (typeof last_time == 'undefined') {
  		last_time = (now.getUTCFullYear()-10).toString() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + now.getUTCMilliseconds().toString(); 
	}
}


function getPaints(){

	updateTime();

	$.ajax({
		type: "get",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: {room: room_id, time_start: last_time, time_end: actual_time},
		success: function(data){
			//console.log("SUCCESS");
			//console.log(JSON.stringify(data));
			if(data.length > 0){
				last_time = data[data.length-1].time;

				var draw = [];

				for(var i = 0; i < data.length; i++){

					var type = data[i].type;

					if(repaint_all || user_id != data[i].id_user){
						if(type == 'rect')
							rectPaint(data[i]);
						else if(type == 'circle')
							circlePaint(data[i]);
						else if(type == 'line')
							linePaint(data[i]);
						else if(type == 'text')
							textPaint(data[i]);
						else if(type == 'spray')
							sprayPaint(data[i]);
						else if(type == 'brush'){
							if(draw.length == 0)
								draw.push(data[i]);
							else if(draw[draw.length-1].type == 'brush')
								draw.push(data[i]);
							else{
								brushPaint(draw);
								draw = [];
								draw.push(data[i]);
							}

							if(i == data.length - 1)
								brushPaint(draw);
						}
						else if(type == 'eraser'){
							if(draw.length == 0)
								draw.push(data[i]);
							else if(draw[draw.length-1].type == 'eraser')
								draw.push(data[i]);
							else{
								brushPaint(draw);
								draw = [];
								draw.push(data[i]);
							}

							if(i == data.length - 1)
								brushPaint(draw);
						}
					}
				}
			}
			repaint_all = false;
			getPaints();
		}
	});
}


////////////////////////////////////////////////////////////////
////////////////PAINTING FUNCTIONS AFTER REQUESTS///////////////
////////////////////////////////////////////////////////////////

function brushPaint(ppts){
	//console.log("BRUSH PAINT: PINTAR " + ppts.length + " PONTOS");

	for(var i = 0; i < ppts.length; i++){

		if(ppts[i].type == 'eraser'){
			//console.log("ERASER COLOR: " + ppts[i].color);
			tmp_ctx.strokeStyle = '#ffffff';
			tmp_ctx.fillStyle = '#ffffff';	
		}
		else{
			tmp_ctx.strokeStyle = ppts[i].color;
			tmp_ctx.fillStyle = ppts[i].color;	
		}
		tmp_ctx.lineWidth = ppts[i].line_width;
		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		//console.log(ppts[i].line_id);

		if(i > 0){
			if(ppts[i].line_id != ppts[i-1].line_id){
				//console.log("MUDAR LINHA!");
				//e se for so um ponto?
				//verificar se ha 
				if(ppts.length > i+2){
					//console.log("A");
					//verificar se 2 posiçoes a frente é o mesmo id
					if(ppts[i+2].line_id == ppts[i].line_id){
						//console.log("B");
						tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

						tmp_ctx.beginPath();
						tmp_ctx.moveTo(ppts[i].pos_x, ppts[i].pos_y);

						for (var j = i; j < ppts.length - 2; j++) {
							var c = (parseFloat(ppts[j].pos_x) + parseFloat(ppts[j + 1].pos_x)) / 2;
							var d = (parseFloat(ppts[j].pos_y) + parseFloat(ppts[j + 1].pos_y)) / 2;

							tmp_ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, c, d);
							if(ppts[j].line_id != ppts[j+2].line_id)
								break;
						}

						// For the last 2 points
						tmp_ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, ppts[j + 1].pos_x, ppts[j + 1].pos_y);
						tmp_ctx.stroke();
						ctx.drawImage(tmp_canvas, 0, 0);
					}
					else{
						tmp_ctx.beginPath();
						tmp_ctx.arc(ppts[i].pos_x, ppts[i].pos_y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
						tmp_ctx.fill();
						tmp_ctx.closePath();
						ctx.drawImage(tmp_canvas, 0, 0);
					}
				}
				else{
					tmp_ctx.beginPath();
					tmp_ctx.arc(ppts[i].pos_x, ppts[i].pos_y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
					tmp_ctx.fill();
					tmp_ctx.closePath();
					ctx.drawImage(tmp_canvas, 0, 0);
				}
				
			}
		}
		else{
			if(ppts.length > 3){
				if(ppts[2].line_id == ppts[0].line_id){
						//tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

						tmp_ctx.beginPath();
						tmp_ctx.moveTo(ppts[0].pos_x, ppts[0].pos_y);

						for (var j = 0; j < ppts.length - 2; j++) {
							//console.log(ppts[j].pos_x + " / " +  ppts[j + 1].pos_x);
							//console.log(ppts[j].pos_y + " / " +  ppts[j + 1].pos_y);

							var c = (parseFloat(ppts[j].pos_x) + parseFloat(ppts[j + 1].pos_x)) / 2;
							var d = (parseFloat(ppts[j].pos_y) + parseFloat(ppts[j + 1].pos_y)) / 2;

							//console.log("X: " + ppts[j].pos_x + " /  Y: " + ppts[j].pos_y);
							//console.log("C: " + c + " /  D: " + d);
							tmp_ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, c, d);
							if(ppts[j].line_id != ppts[j+2].line_id)
								break;
						}

						// For the last 2 points
						tmp_ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, ppts[j + 1].pos_x, ppts[j + 1].pos_y);
						tmp_ctx.stroke();
						ctx.drawImage(tmp_canvas, 0, 0);
				}
			}
			//console.log("X");
			tmp_ctx.beginPath();
			tmp_ctx.arc(ppts[i].pos_x, ppts[i].pos_y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			ctx.drawImage(tmp_canvas, 0, 0);
		}
	}
	ctx.drawImage(tmp_canvas, 0, 0);
}


function sprayPaint(ppts){
	//console.log("LENGTH: " + ppts.length);
	
	//console.log("AQUI");
	tmp_ctx.lineWidth = ppts.line_width;
	tmp_ctx.fillStyle = ppts.color;

	var pos_x = ppts.pos_x;
	var pos_y = ppts.pos_y;

	//console.log("WIDTH: " + tmp_ctx.lineWidth);

	var spray_width = tmp_ctx.lineWidth/1.7;
	var density = spray_width * 5;
	
	for (var j = 0; j < density; j++) {
		var offset = getRandomOffset(spray_width);
		
		var x = parseInt(pos_x) + parseFloat(offset.x);
		var y = parseInt(pos_y) + parseFloat(offset.y);
		
		//console.log("OFFSET: " + offset.x + " - " + offset.y);
		//console.log("X-Y: " + x  + " " + y);

		tmp_ctx.fillRect(x, y, 1, 1);
	}
	

	ctx.drawImage(tmp_canvas, 0, 0);
}


function insertRectangle(){
	var x = Math.min(mouse.x, start_mouse.x);
	var y = Math.min(mouse.y, start_mouse.y);
	var width = Math.abs(mouse.x - start_mouse.x);
	var height = Math.abs(mouse.y - start_mouse.y);

	var data = { "room": room_id, "user": user_id, "type" : "rect", "line_width" : tmp_ctx.lineWidth, "pos_x" : x, "pos_y" : y, "color" : tmp_ctx.fillStyle, "width": width, "height": height };
	
	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log(data);
		}, 
	});
}

function insertCircle(){

	var x = (mouse.x + start_mouse.x) / 2;
	var y = (mouse.y + start_mouse.y) / 2;

	var radius = Math.max(
		Math.abs(mouse.x - start_mouse.x),
		Math.abs(mouse.y - start_mouse.y)) / 2;

	var data = { "room": room_id, "user": user_id, "type" : "circle", "line_width" : tmp_ctx.lineWidth, "pos_x" : x, "pos_y" : y, "color" : tmp_ctx.strokeStyle, "width": radius};

	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log(data);
		}, 
	});
}

function insertLine(){

	var start_x = start_mouse.x;
	var start_y = start_mouse.y;
	var end_x = mouse.x;
	var end_y = mouse.y;

	var data = { "room": room_id, "user": user_id, "type" : "line", "line_width" : tmp_ctx.lineWidth, "pos_x" : start_x, "pos_y" : start_y, "color" : tmp_ctx.strokeStyle, "width": end_x, "height": end_y};

	$.ajax({
		type: "post",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data),
		success: function(data){
			//console.log(data);
		}, 
	});
}

function rectPaint(ppts){

	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	
	tmp_ctx.lineWidth = ppts.line_width;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = ppts.color;
	tmp_ctx.fillStyle = ppts.color;

	tmp_ctx.strokeRect(ppts.pos_x, ppts.pos_y, ppts.width, ppts.height);

	ctx.drawImage(tmp_canvas, 0, 0);
	
}

function circlePaint(ppts){

	var radius = ppts.width;

	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.lineWidth = ppts.line_width;
	tmp_ctx.strokeStyle = ppts.color;

	tmp_ctx.beginPath();
	tmp_ctx.arc(ppts.pos_x, ppts.pos_y, radius, 0, Math.PI * 2, false);
	tmp_ctx.stroke();
	tmp_ctx.closePath();

	ctx.drawImage(tmp_canvas, 0, 0);
	
}

function linePaint(ppts){

	var start_x = ppts.pos_x;
	var start_y = ppts.pos_y;
	var end_x = ppts.width;
	var end_y = ppts.height;


	tmp_ctx.lineWidth = ppts.line_width;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = ppts.color;
	tmp_ctx.fillStyle = ppts.color;


	// Tmp canvas is always cleared up before drawing.
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

	tmp_ctx.beginPath();
	tmp_ctx.moveTo(start_x, start_y);
	tmp_ctx.lineTo(end_x, end_y);
	tmp_ctx.stroke();
	tmp_ctx.closePath();

	ctx.drawImage(tmp_canvas, 0, 0);
	
}

/*
function eraserPaint(ppts){
	//console.log("ERASERPAINT");
	//console.log("BRUSH PAINT: PINTAR " + ppts.length + " PONTOS");
	

	for(var i = 0; i < ppts.length; i++){
		tmp_canvas.style.display = 'none';
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth = ppts[i].line_width;

		tmp_ctx.lineWidth = ppts[i].line_width;
		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		tmp_ctx.strokeStyle = ppts[i].color;
		tmp_ctx.fillStyle = ppts[i].color;

		//console.log(ppts[i].line_id);

		if(i > 0){
			if(ppts[i].line_id != ppts[i-1].line_id){
				//console.log("MUDAR LINHA!");
				//e se for so um ponto?
				//verificar se ha 
				if(ppts.length > i+2){
					//console.log("A");
					//verificar se 2 posiçoes a frente é o mesmo id
					if(ppts[i+2].line_id == ppts[i].line_id){
						//console.log("B");
						//tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

						ctx.beginPath();
						ctx.moveTo(ppts[i].pos_x, ppts[i].pos_y);

						for (var j = i; j < ppts.length - 2; j++) {
							var c = (parseFloat(ppts[j].pos_x) + parseFloat(ppts[j + 1].pos_x)) / 2;
							var d = (parseFloat(ppts[j].pos_y) + parseFloat(ppts[j + 1].pos_y)) / 2;

							ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, c, d);
							if(ppts[j].line_id != ppts[j+2].line_id)
								break;
						}

						// For the last 2 points
						ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, ppts[j + 1].pos_x, ppts[j + 1].pos_y);
						ctx.stroke();
						//ctx.drawImage(tmp_canvas, 0, 0);
					}
					else{
						ctx.beginPath();
						ctx.arc(ppts[i].pos_x, ppts[i].pos_y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
						ctx.fill();
						ctx.closePath();
						//ctx.drawImage(tmp_canvas, 0, 0);
					}
				}
				else{
					ctx.beginPath();
					ctx.arc(ppts[i].pos_x, ppts[i].pos_y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
					ctx.fill();
					ctx.closePath();
					//ctx.drawImage(tmp_canvas, 0, 0);
				}
				
			}
		}
		else{
			if(ppts.length > 3){
				if(ppts[2].line_id == ppts[0].line_id){
						//tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

						ctx.beginPath();
						ctx.moveTo(ppts[0].pos_x, ppts[0].pos_y);

						for (var j = 0; j < ppts.length - 2; j++) {
							//console.log(ppts[j].pos_x + " / " +  ppts[j + 1].pos_x);
							//console.log(ppts[j].pos_y + " / " +  ppts[j + 1].pos_y);

							var c = (parseFloat(ppts[j].pos_x) + parseFloat(ppts[j + 1].pos_x)) / 2;
							var d = (parseFloat(ppts[j].pos_y) + parseFloat(ppts[j + 1].pos_y)) / 2;

							//console.log("X: " + ppts[j].pos_x + " /  Y: " + ppts[j].pos_y);
							//console.log("C: " + c + " /  D: " + d);
							ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, c, d);
							if(ppts[j].line_id != ppts[j+2].line_id)
								break;
						}

						// For the last 2 points
						ctx.quadraticCurveTo(ppts[j].pos_x, ppts[j].pos_y, ppts[j + 1].pos_x, ppts[j + 1].pos_y);
						ctx.stroke();
						//ctx.drawImage(tmp_canvas, 0, 0);
				}
			}
			//console.log("X");
			ctx.beginPath();
			ctx.arc(ppts[i].pos_x, ppts[i].pos_y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			//ctx.drawImage(tmp_canvas, 0, 0);
		}
		ctx.globalCompositeOperation = 'source-over';
		tmp_canvas.style.display = 'block';
	}
	
	//ctx.drawImage(tmp_canvas, 0, 0);
}
*/

function textPaint(ppts){

	tmp_ctx.fillStyle = ppts.color;
	var lines = ppts.text.split('\n');
	var processed_lines = [];
	
	for (var i = 0; i < lines.length; i++) {
		var chars = lines[i].length;
		for (var j = 0; j < chars; j++) {
			var text_node = document.createTextNode(lines[i][j]);
			tmp_txt_ctn.appendChild(text_node);
			
			// Since tmp_txt_ctn is not taking any space
			// in layout due to display: none, we gotta
			// make it take some space, while keeping it
			// hidden/invisible and then get dimensions
			tmp_txt_ctn.style.position   = 'absolute';
			tmp_txt_ctn.style.visibility = 'hidden';
			tmp_txt_ctn.style.display    = 'block';
			
			var width = tmp_txt_ctn.offsetWidth;
			var height = tmp_txt_ctn.offsetHeight;
			
			tmp_txt_ctn.style.position   = '';
			tmp_txt_ctn.style.visibility = '';
			tmp_txt_ctn.style.display    = 'none';
			
			// Logix
			// console.log(width, parseInt(textarea.style.width));
			if (width > parseInt(textarea.style.width)) {
				break;
			}
		}
		
		processed_lines.push(tmp_txt_ctn.textContent);
		tmp_txt_ctn.innerHTML = '';
	}
	
	var font_size = ppts.line_width;
	var ta_comp_style = getComputedStyle(textarea);
	var fs = font_size + 'px';
	var ff = ta_comp_style.getPropertyValue('font-family');
	
	//console.log("FONT SIZE: " + fs);
	//console.log("FONTE FAMILY " + ff);

	tmp_ctx.font = fs + ' ' + ff;
	tmp_ctx.textBaseline = 'top';
	tmp_ctx.strokeStyle = ta_comp_style.getPropertyValue('color');
	tmp_ctx.fillStyle = ta_comp_style.getPropertyValue('color');

	for (var n = 0; n < processed_lines.length; n++) {
		var processed_line = processed_lines[n];
		
		tmp_ctx.fillText(
			processed_line,
			parseInt(ppts.pos_x),
			parseInt(ppts.pos_y) + n*parseInt(fs)
		);
	}

	// Writing down to real canvas now
	ctx.drawImage(tmp_canvas, 0, 0);
	// Clearing tmp canvas
	tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	
	// clearInterval(sprayIntervalID);
	textarea.style.display = 'none';
	textarea.value = '';


}


////////////////////////////////////////////////////////////////
//////////////////////////CHAT FUNCTIONS////////////////////////
////////////////////////////////////////////////////////////////

var chat_last_time;
var chat_actual_time; 

function updateChatTime(){

	var now = new Date(); 
	var month = now.getUTCMonth()+1;
	if(month < 10)
		month = '0' + month;
	var day = now.getUTCDate();
	if(day < 10)
		day = '0' + day;
	var hours = now.getUTCHours();
	if(hours < 10)
		hours = '0' + hours;
	var minutes = now.getUTCMinutes();
	if(minutes < 10)
		minutes = '0' + minutes;
	var seconds = now.getUTCSeconds();
	if(seconds < 10)
		seconds = '0' + seconds;

	chat_actual_time = now.getUTCFullYear().toString() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + now.getUTCMilliseconds().toString();

	if (typeof chat_last_time == 'undefined') {
  		chat_last_time = (now.getUTCFullYear()-10).toString() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + now.getUTCMilliseconds().toString();
	}
}

function getChat(){

	updateChatTime();

	//console.log("CHAT LAST: " + chat_last_time);
	//console.log("CHAT ACTUAL: " + chat_actual_time);
	
	$.ajax({
		type: "get",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/chat", 
		dataType: "json",
		contentType: "application/json",
		data: {room_id: room_id, time_start: chat_last_time, time_end: chat_actual_time},
		success: function(data){
			//console.log(data);
			if(data.length > 0){
				chat_last_time = data[data.length-1].time;

				var date = new Date()
				var offset = (date.getTimezoneOffset()/60);
				for(var i = 0; i < data.length; i++){


					var dateSplit = data[i].time.split(" ");
					var timeSplit = dateSplit[1].split(":");
					timeSplit[0] = parseInt(timeSplit[0]) - parseInt(offset) + 1;
					var time = timeSplit[0]+ ":" +timeSplit[1]+ ":" + timeSplit[2];

					$("#chat_div").chatbox("option", "boxManager").addMsg(data[i].name + '   ' + time, data[i].message);
				}
			}

		}
	});
	
}


function getPeople(){
	$.ajax({
		type: "get",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/user?roomName=" + room_name.replace("%20", " "), 
		dataType: "json",
		contentType: "application/json",
		success: function(data){

			$('#people > span').remove();
			$('#people > br').remove();
			for(var i = 0; i < data.length; i++){
				$('#people').append("<span>" + data[i].name + "</span><br>");
			}

		}
	});
}



