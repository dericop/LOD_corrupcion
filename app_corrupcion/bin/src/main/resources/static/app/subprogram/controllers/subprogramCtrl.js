(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('subprogramController', subprogramController);

	subprogramController.$inject = ["$scope", "TourFactory", "$state"];
	
	function subprogramController($scope){

		var that = this;
		
		that.makeBarChart = makeBarChart;
		that.makeDonutChart = makeDonutChart;

		that.makeBarChart();
		that.makeDonutChart();

		function makeDonutChart(){
			var svg = d3.select("#vis_pie_svg"),
				width = $("#vis_pie_svg").parent().width(),
				height = $("#vis_pie_svg").parent().height(),
			    radius = Math.min(width, height) / 2;

			svg.attr("width", width);
			svg.attr("height", height);

			var format = d3.format(",d");

			var color = d3.scaleOrdinal()
			    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(radius - 70);

			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d.amount; });

			var g1 = svg.append("g");
			g1.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			d3.csv("../../../assets/donut.csv", type, function(error, data) {
			  if (error) throw error;

			  var g = g1.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data.type); });

			  g.append("text")
			      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .attr("text-anchor", "middle")
			      .text(function(d) { return "$"+format(d.data.amount); });

			  var tipos = data.map(function(d){ return d.type; });

			  console.log("data");
			  console.log(data);
			  console.log("tipos");
			  console.log(tipos)

			  var centerx = width/2 - 45;
			  var centery = height/2 - 20;

			  var legendCont = svg.append("g")
									.attr("transform", "translate(" + centerx + "," + centery + ")");

			  var legend = legendCont.selectAll(".leg")
										.data(tipos)
										.enter().append("g");

			  legend.append("rect").attr("width", 10).attr("height", 10).attr("x", 0).attr("y", function(d, i){ return i * 15; })
					.style("fill", function(d){ return color(d); });

			  legend.append("text").attr("fill", "#000")
						 .attr("x", 15)
						 .attr("y", function(d,i){ return (i * 15) + 10; })
						 .style("font", "10px sans-serif")
						 .text(function(d){ return d; });

			});

			function type(d) {
			  d.amount = +d.amount;
			  return d;
			}
		}

		function makeBarChart(){

			var format = d3.format(",d");

			var svg = d3.select("#vis_program_svg"),
			    width = $("#vis_program_svg").parent().width(),
			    height = $("#vis_program_svg").parent().height();

			svg.attr("width", width);
			svg.attr("height", height);

			var margin = {top: 50, right: 100, bottom: 30, left: 100},
				width = +svg.attr("width") - margin.left - margin.right,
				height = +svg.attr("height") - margin.top - margin.bottom,
				g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var y = d3.scaleBand()			// x = d3.scaleBand()	
					    .rangeRound([0, height])	// .rangeRound([0, width])
					    .paddingInner(0.05)
					    .align(0.1);
			
			var x = d3.scaleLinear()		// y = d3.scaleLinear()
    					.rangeRound([0, width]);	// .rangeRound([height, 0]);

			var z = d3.scaleOrdinal()
			.range(["#7b6888", "#6b486b"]);

			var stack = d3.stack()
							.offset(d3.stackOffsetExpand);

			d3.csv("../../../assets/sectores.csv", type, function(error, data) {
				if (error) throw error;

				var keys = ["ejecutado", "por ejecutar"]

				data.sort(function(a, b) { return b[keys[0]] / b.presupuesto - a[keys[0]] / a.presupuesto; });

				y.domain(data.map(function(d) { return d.nombre; }));
				z.domain(keys);

				var serie = g.selectAll(".serie")
							  .data(stack.keys(keys)(data))
							  .enter().append("g")
							    .attr("class", "serie")
							    .attr("fill", function(d) { return z(d.key); });

				serie.selectAll("rect")
					  .data(function(d) { return d; })
					  .enter().append("rect")
					    .attr("y", function(d) { return y(d.data.nombre); })
					    .attr("height", y.bandwidth())
					    .transition().duration(1000)
					    .attr("x", function(d) { return x(d[0]); })
					    .attr("width", function(d) { return x(d[1]) - x(d[0]); });
					    

				var yAxis = g.append("g")
							    .attr("class", "axis axis--y")
							    .attr("transform", "translate(0,0)")
							    .call(d3.axisLeft(y));

				var barWidth = margin.left - 15;

				function wrap() {
					var padding = 0;
				  	var self = d3.select(this),
				    	textLength = self.node().getComputedTextLength(),
				    	text = self.text();
				  	while (textLength > (barWidth - 2 * padding) && text.length > 0) {
				    	text = text.slice(0, -1);
				    	self.text(text + '...');
				    	textLength = self.node().getComputedTextLength();
				  	}
				}

				yAxis.selectAll(".tick")
					  .selectAll("text")
					  .html("")
					  .append('tspan').text(function(d) {
					    return d;
					  }).each(wrap);

				g.append("g")
					.attr("transform", "translate("+width+",0)")
					.attr("class", "axis axis--y")
					.call(d3.axisRight(y).tickFormat(function(d){ 
																	var x = data.filter(function(e){ return e.nombre == d; })[0];																	
																	return "$"+format(x.presupuesto);
																}))

				g.append("g")
				    .attr("class", "axis axis--x")
				    .call(d3.axisTop(x).ticks(10, "%"));

				var legendCont = svg.append("g")
									 .attr("transform", "translate("+margin.left+",0)");

				var legend = legendCont.selectAll(".leg")
						.data(keys)
						.enter().append("g");

				legend.append("rect").attr("width", 10).attr("height", 10).attr("x", function(d, i){ return i * 100; }).attr("y", 5)
						.style("fill", function(d){ return z(d); });

				legend.append("text").attr("fill", "#000")
						 .attr("x", function(d, i){ return i * 100 + 12; })
						 .attr("y", 13)
						 .style("font", "10px sans-serif")
						 .text(function(d){ return d; });

			});

			function type(d) {
				d.presupuesto = +d.presupuesto;
				d.percEx = +d.ejecutado/+d.presupuesto;
				d.ejecutado = +d.ejecutado;
				d["por ejecutar"] = d.presupuesto - d.ejecutado;
				return d;
			}

		}

	}
	
})();