//init_sketch();
setInterval(getPaints, 1000);

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
		//console.log('click');
		tmp_canvas.style.display = 'block';
		if(jQuery(this).attr('id') == 'new'){
			//console.log(canvas.width);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		else if(jQuery(this).attr('id') != 'eraser')
			tool = jQuery(this).attr('id');
	});

	jQuery('#new').on('click', function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});

	document.querySelector('#eraser').onclick = function () {
		if (this.checked){
			tool = 'eraser';
		}

		// Hide Tmp Canvas
		tmp_canvas.style.display = 'none';
	};


	//TEMPORARY CANVAS
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;

	sketch.appendChild(tmp_canvas);


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
			tmp_canvas.addEventListener('mousemove', onPaint, false);
			//onPaint();
		}
		else if(tool == 'spray'){
			tmp_canvas.addEventListener('mousemove', onSprayPaint, false);
			sprayIntervalID = setInterval(onSprayPaint, 50);
		}

	}, false);

	tmp_canvas.addEventListener('mouseup', function () {
		tmp_canvas.removeEventListener('mousemove', onLinePaint, false);
		tmp_canvas.removeEventListener('mousemove', onRectPaint, false);
		tmp_canvas.removeEventListener('mousemove', onBrushPaint, false);
		tmp_canvas.removeEventListener('mousemove', onCirclePaint, false);
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		tmp_canvas.removeEventListener('mousemove', onSprayPaint, false);
		clearInterval(sprayIntervalID);


		///////////////////////////////////////////////////////
		if (tool == 'addtext')
		{

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
			
			tmp_ctx.font = fs + ' ' + ff;
			tmp_ctx.textBaseline = 'top';
			
			for (var n = 0; n < processed_lines.length; n++) {
				var processed_line = processed_lines[n];
				
				tmp_ctx.fillText(
					processed_line,
					parseInt(textarea.style.left),
					parseInt(textarea.style.top) + n*parseInt(fs)
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
		else{
	
			// Writing down to real canvas now
			ctx.drawImage(tmp_canvas, 0, 0);
			// Clearing tmp canvas
			tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

			ppts = [];
		}


	}, false);

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



////////////////////////////////////////////////////////////////////////
/////////////////////////////TOOL FUNCTIONS/////////////////////////////
////////////////////////////////////////////////////////////////////////


	var onPaint = function() {
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
			
			textarea.style.left = x + 'px';
			textarea.style.top = y + 'px';
			textarea.style.width = width + 'px';
			textarea.style.height = height + 'px';
			
			textarea.style.display = 'block';

			//console.log('paint');
		};

	var onErase = function () {

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

			return;
		}

		// Tmp canvas is always cleared up before drawing.
		//ctx.clearRect(0, 0, canvas.width, canvas.height);

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

	var onBrushPaint = function (points) {
		console.log("OLE");

		if(ppts.length == 0){
			//gerar novo id
			console.log("NEW ID!");
			now = new Date();
			line_id = now.getUTCMinutes().toString() + now.getUTCSeconds().toString() + now.getUTCMilliseconds().toString();
		}
	//console.log("a");
		ppts.push({
			x: mouse.x,
			y: mouse.y
		});
		
	

		console.log(ppts);
		
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
			var data = { "room": 3, "type" : "brush", "width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : tmp_ctx.fillStyle, "line_id" : line_id };
			console.log(data);
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
		
		var data = { "room": 3, "type" : "brush", "width" : tmp_ctx.lineWidth, "pos_x" : mouse.x, "pos_y" : mouse.y, "color" : tmp_ctx.fillStyle, "line_id": line_id };
		//console.log(JSON.stringify(data));

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
		//tmp_ctx.lineJoin = 'round';
		//tmp_ctx.lineCap = 'round';
		//tmp_ctx.strokeStyle = $('#selColor').val();
		tmp_ctx.fillStyle = $('#swatch').css('background-color');

		var x = mouse.x;
		var y = mouse.y;
		
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

function parseResponse(data){
	//console.log("OI");
	//console.log(data);

	$.ajax({
			type: "get",
			url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint.js", 
			dataType: "json",
			contentType: "application/json",
			data: {room: 2}
		});
}

function count(data){
	console.log("COUNT");
	console.log(data.length);
}

var last_time;
var actual_time;

function updateTime(){

	var now = new Date(); 
	actual_time = now.getUTCFullYear().toString() + '-' + now.getUTCMonth().toString() + '-' + now.getUTCDate().toString() + ' ' + now.getUTCHours().toString() + ':' + now.getUTCMinutes().toString() + ':' + now.getUTCSeconds().toString() + '.' + now.getUTCMilliseconds().toString();

	if (typeof last_time == 'undefined') {
  		last_time = (now.getUTCFullYear()-10).toString() + '-' + now.getUTCMonth().toString() + '-' + now.getUTCDate().toString() + ' ' + now.getUTCHours().toString() + ':' + now.getUTCMinutes().toString() + ':' + now.getUTCSeconds().toString() + '.' + now.getUTCMilliseconds().toString();
	}
}


function getPaints(){

	updateTime();

	//console.log("LAST: " + last_time);
	//console.log("ACTUAL: " + actual_time);
	//fazer get dos paints desta room
	//descobrir room
	$.ajax({
		type: "get",
		url: "http://paginas.fe.up.pt/~ei11083/sdis_rest/index.php/paint", 
		dataType: "json",
		contentType: "application/json",
		data: {room: 3, time_start: last_time, time_end: actual_time},
		success: function(data){
			//console.log("SUCCESS");
			//console.log(JSON.stringify(data));
			if(data.length > 0){
				last_time = data[data.length-1].time;

				var points = []; 
				for(var i = 0; i < data.length; i++){
					points.push({
						line_id: data[i].line_id, 
						width: data[i].width,
						color: data[i].color,
						pos_x: data[i].pos_x,
						pos_y: data[i].pos_y
					});
				}

				brushPaint(points);
			}
			//console.log(data[0].time);
			console.log(data.length);
			

		}
	});
}


function brushPaint(ppts){
	console.log("BRUSH PAINT: PINTAR " + ppts.length + " PONTOS");

	for(var i = 0; i < ppts.length; i++){

		tmp_ctx.lineWidth = ppts[i].width;
		tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = 'round';
		tmp_ctx.strokeStyle = ppts[i].color;
		tmp_ctx.fillStyle = ppts[i].color;

		console.log(ppts[i].line_id);

		if(i > 0){
			if(ppts[i].line_id != ppts[i-1].line_id){
				console.log("MUDAR LINHA!");
				//e se for so um ponto?
				//verificar se ha 
				if(ppts.length > i+2){
					console.log("A");
					//verificar se 2 posiçoes a frente é o mesmo id
					if(ppts[i+2].line_id == ppts[i].line_id){
						console.log("B");
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
			console.log("X");
			tmp_ctx.beginPath();
			tmp_ctx.arc(ppts[i].pos_x, ppts[i].pos_y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			ctx.drawImage(tmp_canvas, 0, 0);
		}
	}
	ctx.drawImage(tmp_canvas, 0, 0);
}