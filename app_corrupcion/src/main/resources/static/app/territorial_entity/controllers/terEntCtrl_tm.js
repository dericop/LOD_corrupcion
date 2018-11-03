(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('territorialEntityController', territorialEntityController);

	territorialEntityController.$inject = ["$scope", "TourFactory", "$state"];
	
	function territorialEntityController($scope){
		var that = this;
		
		that.makeChart = makeChart;

		that.makeChart();

		function makeChart(){

			var svg = d3.select("#vis_svg"),
			    width = $("#vis_svg").parent().width(),
			    height = 700;

			console.log(width);

			svg.attr("width", width);
			svg.attr("height", height);

			var format = d3.format(",d");

			var percentageFormat = d3.format(",.2%");

			var color = d3.scaleLinear()
						  .range(["white", "#409A99"]);	

			var treemap = d3.treemap()
							.size([width, height])
							.padding(3)
							.round(true);

			d3.csv("../../../assets/sectores.csv", type, function(error, data) {
				console.log("data");
				console.log(data);
				if (error) throw error;

				var min = d3.min(data, function(d){ return d.percEx; });
				var max = d3.max(data, function(d){ return d.percEx; });

				color.domain([
					min,
					max
				])

				var root = d3.hierarchy({children:data})
							 .each(function(d){ d.data.presupuesto = +d.data.presupuesto; })
							 .sum(function(d){ return d.presupuesto; })
							 .sort(function(a, b){ return b.data.presupuesto - a.data.presupuesto });

				treemap(root);

				var cell = svg.selectAll("g")
							    .data(root.leaves())
							    .enter().append("g")
							      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

				cell.append("rect")
				    .attr("id", function(d) { console.log(d); return d.data.id; })
				    .attr("width", function(d) { return d.x1 - d.x0; })
				    .attr("height", function(d) { return d.y1 - d.y0; })
				    .attr("fill", function(d) { return color(d.data.percEx); });

				cell.append("clipPath")
				    .attr("id", function(d) { return "clip-" + d.data.id; })
				  .append("use")
				    .attr("xlink:href", function(d) { return "#" + d.data.id; });

				cell.append("text")
				    .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
				  .selectAll("tspan")
				    .data(function(d) { return (d.data.nombre+" - $"+format(d.data.presupuesto)).split(/(?=[A-Z][^A-Z])/g); })
				  .enter().append("tspan")
				    .attr("x", 4)
				    .attr("y", function(d, i) { return 13 + i * 10; })
				    .text(function(d) { return d; });

				cell.append("title")
				      .text(function(d) { return "Sector: "+d.data.nombre + "\nPresupuesto asignado: $" + format(d.data.presupuesto)+"\nPresupuesto ejecutado: $"+format(d.data.ejecutado)+" ("+(100*(d.data.percEx.toFixed(4)))+"%)"; });

			});

			function type(d, i) {
				d.id = i;
				d.presupuesto = +d.presupuesto;
				d.percEx = +d.ejecutado/+d.presupuesto;
				return d;
			}

		}

	}
	
})();