$(function(){

	/* Carga de rutas de archivos */

	function getDeptPath(nombre_dept){
		return "assets/vis2/data/visualizaciones_gobernaciones/"+nombre_dept+".csv";
	}

	function getMunsPath(nombre_dept){
		return "assets/vis2/data/visualizaciones_municipios/"+nombre_dept+".csv";
	}

	/* Carga de nombres de departamentos y municipios */

	var dpts = ["Caldas"];
	var nombres_municipios = {
		"Gobernacion de Caldas" : nombres_municipios_caldas // De archivo data/nombres_municipios/caldas.js
	}

	/* Controles de selección */

	var select_dpt = $("#select_dpt");
	var select_mun = $("#select_mun");

	var selected_dept;

	// Llenar select de departamentos
	
	for(var i in dpts)
		select_dpt.append("<option value='Gobernacion de "+dpts[i]+"'>"+dpts[i]+"</option>");
	select_dpt.selectpicker({
		"title" : "Escoge un departamento"
	})

	// Evento de click en el select de departamento

	select_dpt.on("hidden.bs.select", function(){
		selected_dept = $(this).val();		
		showDptVis(selected_dept);
	})

	// Llenar select de municipios

	function fillSelectMun(dept_nombre){
		select_mun.html('');
		var current_muns = nombres_municipios[dept_nombre];
		for(var i in current_muns)
			select_mun.append("<option value='"+current_muns[i]+"'>"+current_muns[i]+"</option>");
		select_mun.prop("disabled", false);
		select_mun.selectpicker("refresh");
	}

	// Evento de click en el select de municipio

	select_mun.on("changed.bs.select", function(){
		showMunVis($(this).val());
	})

	/* Info del lado */

	var header_ent_name = $("#header_ent_name");
	var header_ent_money = $("#header_ent_money");

	function mouseout(d){
		header_ent_name.html('');
		header_ent_money.html('');
	}

	/* Visualizaciones */

	var svg = d3.select("svg"),
		width = $("#vis-container").width(),
		height = 800;

	$("#info-container").height(height);

	svg.attr("width", width);
	svg.attr("height", height)

	var format = d3.format(",d"),
		moneyFormat = d3.format(",");

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var pack = d3.pack()
    			 .size([width, height])
    			 .padding(1);

	// Limpiar la visualización

	function clearVis(){
		svg.selectAll("*").remove();
	}

	// Mostrar visualización con datos de municipio (Repeti codigo por el afan, tal vez arregle, tal vez no)

	function showMunVis(mun_nombre){
		clearVis();
		$.ajax({
			url: "app/contratosMunicipio",
			type: "GET",
			data: {
				municipio: mun_nombre
			},
			success:function(data){
				drawVis(JSON.parse(data).results.bindings);
			}
		});
		function drawVis(raw_data){

			for(var i in raw_data)
				raw_data[i] = type(raw_data[i]);

			var data = d3.nest()
							.key(function(d){ return d.entidad; })
							.rollup(function(d){ return d3.sum(d, function(e){ return e.cantidad }) })
							.entries(raw_data);

			for(var i in data)
				data[i].id = i;

			var root = d3.hierarchy({children:data})
						 .sum(function(d){return d.value; })
						 .each(function(d){
						 	d.id = d.data.id;
						 });

			var node = svg.selectAll(".node")
               .data(pack(root).leaves())
               .enter().append("g")
               .attr("class", "node")
               .attr("transform", function(d){ return "translate("+d.x+","+d.y+")"; });

            node.append("circle")
               .attr("id", function(d) { return d.id; })
               .attr("r", function(d) { return d.r; })
               .style("fill", function(d) { return color(d.id); });

            node.append("clipPath")
               .attr("id", function(d) { return "clip-" + d.id; })
               .append("use")
               .attr("xlink:href", function(d) { return "#" + d.id; });

            node.append("text")
               .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
               .selectAll("tspan")
               .data(function(d) { return (d.data.key+" - $"+moneyFormat(d.data.value)).split(/(?=[A-Z][^A-Z])/g); })
               .enter().append("tspan")
               .attr("x", 0)
               .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
               .text(function(d) { return d; });

            node.append("title")
               .text(function(d) { return d.data.key + "\n$" + moneyFormat(d.data.value); });

            node.on('mouseover', mouseover_dept)
            	.on('mouseout', mouseout);
		}

		function mouseover_dept(d){
			var nombre = d.data.key;
			var cantidad = "$"+moneyFormat(d.data.value);
			header_ent_name.html(nombre);
			header_ent_money.html(cantidad);
		}

		function type(d, i){
			d.cantidad = +d.cantidad.value;
			d.entidad = d.entidad.value;
			return d;
		}

	}	

	// Mostrar visualización con datos de gobernación

	function showDptVis(dept_nombre){
		clearVis();
		$.ajax({
			url: "app/contratosGobernacion",
			type: "GET",
			data: {
				gobernacion: dept_nombre
			},
			success:function(data){
				drawVis(JSON.parse(data).results.bindings);
				fillSelectMun(dept_nombre);
			}
		});

		function drawVis(data){

			console.log(data);

			for(var i in data)
				data[i] = type(data[i], i);

			var root = d3.hierarchy({children:data})
						 .sum(function(d){return d.cantidad; })
						 .each(function(d){
						 	d.id = d.data.id;
						 });

			var node = svg.selectAll(".node")
               .data(pack(root).leaves())
               .enter().append("g")
               .attr("class", "node")
               .attr("transform", function(d){ return "translate("+d.x+","+d.y+")"; });

            node.append("circle")
               .attr("id", function(d) { return d.id; })
               .attr("r", function(d) { return d.r; })
               .style("fill", function(d) { return color(d.id); });

            node.append("clipPath")
               .attr("id", function(d) { return "clip-" + d.id; })
               .append("use")
               .attr("xlink:href", function(d) { return "#" + d.id; });

            node.append("text")
               .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
               .selectAll("tspan")
               .data(function(d) { return (d.data.nombre+" - $"+moneyFormat(d.data.cantidad)).split(/(?=[A-Z][^A-Z])/g); })
               .enter().append("tspan")
               .attr("x", 0)
               .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
               .text(function(d) { return d; });

            node.append("title")
               .text(function(d) { return d.data.nombre + "\n$" + moneyFormat(d.data.cantidad); });

            node.on('mouseover', mouseover_mun)
            	.on('mouseout', mouseout);
		}

		function mouseover_mun(d){
			var nombre = d.data.nombre;
			var cantidad = "$"+moneyFormat(d.data.cantidad);
			header_ent_name.html(nombre);
			header_ent_money.html(cantidad);
		}

		function type(d, i){
			d.cantidad = +d.cantidad.value;
			d.nombre = d.nombre.value;
			d.id = i;
			return d;
		}

	}

	

	//visualizaciones GIT
	
	//seleccionar los contratos de la gobernacion
	/*$http({
		method: "GET",
		url: "/app/contratosGobernacion",
		params: {gobernacion: "Gobernacion de Caldas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleccionar los contratos de un municipio
	/*$http({
		method: "GET",
		url: "/app/contratosMunicipio",
		params: {municipio: "Aguadas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/

})