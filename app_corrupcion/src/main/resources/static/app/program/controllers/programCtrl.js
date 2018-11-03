(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('programController', programController);

	programController.$inject = ["$scope", "TourFactory", "$state", "$http", "GralFactory"];
	
	function programController($scope, TourFactory, $state, $http, GralFactory){
		var that = this;

		$scope.subprogram = "";
		
		that.makeChart = makeChart;
		that.initialize = initialize;
		that.nextView = nextView;

		that.initialize();

		function initialize(){
			$("#program-details").css("visibility", "hidden")
			$("#subprogram-details").css("visibility", "hidden")
			$http({
				method: "GET",
				url: "app/programasYSubprogramas",
				params: {sector: "http://corrupcion.com/presupuesto#sectorEducacion"}
			}).then(function success(response){
				console.log(response);
				makeChart(response.data);
			}, function error(response){
				console.log("something went wrong");
				console.log(response);
			})
		}

		function nextView(){
			GralFactory.onepage.moveDown();
		}

		function makeChart(data){
			var el_id = 'chart';
		    var obj = document.getElementById(el_id);
		    var divWidth = obj.offsetWidth;
		    var margin = {top: 30, right: 0, bottom: 20, left: 0},
		        width = divWidth -25,
		        height = 580 - margin.top - margin.bottom,
		        formatNumber = d3.format(","),
		        transitioning;
		    // sets x and y scale to determine size of visible boxes
		    var x = d3.scaleLinear()
		        .domain([0, width])
		        .range([0, width]);
		    var y = d3.scaleLinear()
		        .domain([0, height])
		        .range([0, height]);
		    var treemap = d3.treemap()
		    		.tile(d3.treemapResquarify)
		            .size([width, height])
		            .paddingInner(0)
		            .round(false);

		    var cpal = [
		    				["#2D882D",
							"#88CC88",
							"#55AA55",
							"#116611",
							"#004400"],
							["#278A6F",
							"#6BB29E",
							"#409980",
							"#137A5D",
							"#04674C"]
		    			];

		    var color = d3.scaleOrdinal(cpal[1]);

		    var svg = d3.select('#'+el_id).append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.bottom + margin.top)
		        .style("margin-left", -margin.left + "px")
		        .style("margin.right", -margin.right + "px")
		        .append("g")
		            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		            .style("shape-rendering", "crispEdges");
		    var grandparent = svg.append("g")
		            .attr("class", "grandparent");
		        grandparent.append("rect")
		            .attr("y", -margin.top)
		            .attr("width", width)
		            .attr("height", margin.top)
		            .attr("fill", '#bbbbbb');
		        grandparent.append("text")
		            .attr("x", 6)
		            .attr("y", 6 - margin.top)
		            .attr("dy", ".75em");
		    
		    for(var i in data)
		    	data[i] = type(data[i]);

		   	function type(d){
				for(var i in d.subprogramas)
					d.subprogramas[i] = sub_type(d.subprogramas[i]);
				function sub_type(e){
					e.value = +e.presupuestoRecursosPropios+e.presupuestoTransferencia;
					return e;
				}	
				return d;
		   	}

		   	function formatPercentage(perc){
				return (Math.round((perc*100) * 100)/100)+"%";
			}

		   	data = { 
		   				"nombre" : "Sector educacion",
		   				"subprogramas" : data
		   		   };

	        var root = d3.hierarchy(data, function(d){ return d.subprogramas; });

	        treemap(root
	            .sum(function (d) {
	                return d.value;
	            })
	            .sort(function (a, b) {
	                return b.height - a.height || b.value - a.value
	            })
	        );

	        display(root);

	        function display(d) {

	            // write text into grandparent
	            // and activate click's handler
	            grandparent
	                .datum(d.parent)
	                .on("click", transition)
	                .select("text")
	                .text(name(d));
	            // grandparent color
	            grandparent
	                .datum(d.parent)
	                .select("rect")
	                .attr("fill", function () {
	                    return '#bbbbbb'
	                });
	            var g1 = svg.insert("g", ".grandparent")
	                .datum(d)
	                .attr("class", "depth");
	            var g = g1.selectAll("g")
	                .data(d.children)
	                .enter().
	                append("g");
	            // add class and click handler to all g's with children
	            g.filter(function (d) {
	                return d.children;
	            })
	                .classed("children", true)
	                .on("click", transition);
	            g.selectAll(".child")
	                .data(function (d) {
	                    return d.children || [d];
	                })
	                .enter().append("rect")
	                .attr("class", "child")
	                .call(rect);
	            // add title to parents
	            g.append("rect")
	                .attr("class", "parent")
	                .call(rect)
	                .append("title")
	                .text(function (d){
	                    return d.data.nombre;
	                });
	                
	            /* Adding a foreign object instead of a text object, allows for text wrapping */
	            g.append("foreignObject")
	                .call(rect)
	                .attr("class", "foreignobj")
	                .append("xhtml:div")
	                .attr("dy", ".75em")
	                .html(function (d) {
	                    return '' +
	                        '<p class="title"> ' + d.data.nombre + '</p>' +
	                        '<p>$' + formatNumber(d.value) + '</p>'
	                    ;
	                })
	                .attr("class", "textdiv"); //textdiv class allows us to style the text easily with CSS
	            d3.selectAll(".depth").selectAll("g").each(function(d, i){ d3.select(this).selectAll("rect").style("fill", color(d.data.nombre)); });
	                //.style("fill", function(g) { console.log(g); return color(g.data.nombre); });
	            d3.selectAll(".depth").selectAll("g").on("mouseover", function(d){		            	
	                d3.select(this).selectAll('rect').style("fill", function() {
	                    return d3.rgb(d3.select(this).style("fill")).darker(0.2);
	                });	                
	                if(d.depth == 1){
	                	// Programa		              
	                	$("#subprogram-details").css("visibility", "hidden")
	                	changeText($("#program-name"), d.data.nombre);
	                	changeText($("#program-value"), "$"+formatNumber(d.value));	                	
	                	changeText($("#program-ex"), "$"+formatNumber(d.data.presupuestoEjecutado));
	                	changeText($("#program-perc"), formatPercentage(d.data.presupuestoEjecutado/d.value));
	                	$("#program-details").css("visibility" , "visible")
	                } else if(d.depth == 2){
	                	// Subprograma		                	
	                	$("#subprogram-details").css("visibility" , "visible")
	                	changeText($("#subprogram-name"), d.data.nombre);
	                	changeText($("#subprogram-value"), "$"+formatNumber(d.value));	
	                	changeText($("#subprogram-ex"), "$"+formatNumber(d.data.presupuestoEjecutado));
	                	changeText($("#subprogram-perc"), formatPercentage(d.data.presupuestoEjecutado/d.value));	                
	                }
	            });
	            d3.selectAll(".depth").selectAll("g").filter(function(d){ return d.depth == 2 })
	            		.on("click", function(d){ 	            			
	            			$scope.subprogram = d.data.uri;
	            			TourFactory.subprogram = $scope.subprogram;
		  					GralFactory.subprogramIsEnabled = true;
		  					$scope.$apply();		  					
			    			nextView();
	            		 })
	            d3.selectAll(".depth").selectAll("g").on("mouseout", function(d){
	                d3.select(this).selectAll('rect').style("fill", function() {
	                    return d3.rgb(d3.select(this).style("fill")).brighter(0.2);
	                });
	            });
	            function changeText(obj, newtext){
	            	obj.fadeOut(function(){
	            		$(this).html(newtext).fadeIn();
	            	})
	            }
	            function transition(d) {
	                if (transitioning || !d) return;
	                transitioning = true;
	                color.domain([]);
	                var g2 = display(d),
	                    t1 = g1.transition().duration(650),
	                    t2 = g2.transition().duration(650);
	                // Update the domain only after entering new elements.
	                x.domain([d.x0, d.x1]);
	                y.domain([d.y0, d.y1]);
	                // Enable anti-aliasing during the transition.
	                svg.style("shape-rendering", null);
	                // Draw child nodes on top of parent nodes.
	                svg.selectAll(".depth").sort(function (a, b) {
	                    return a.depth - b.depth;
	                });
	                // Fade-in entering text.
	                g2.selectAll("text").style("fill-opacity", 0);
	                g2.selectAll("foreignObject div").style("display", "none");
	                /*added*/
	                // Transition to the new view.
	                t1.selectAll("text").call(text).style("fill-opacity", 0);
	                t2.selectAll("text").call(text).style("fill-opacity", 1);
	                t1.selectAll("rect").call(rect);
	                t2.selectAll("rect").call(rect);
	                /* Foreign object */
	                t1.selectAll(".textdiv").style("display", "none");
	                /* added */
	                t1.selectAll(".foreignobj").call(foreign);
	                /* added */
	                t2.selectAll(".textdiv").style("display", "block");
	                /* added */
	                t2.selectAll(".foreignobj").call(foreign);
	                /* added */
	                // Remove the old node when the transition is finished.
	                t1.on("end.remove", function(){
	                    this.remove();
	                    transitioning = false;
	                });
	            }
	            return g;
	        }
	        function text(text) {
	            text.attr("x", function (d) {
	                return x(d.x) + 6;
	            })
	                .attr("y", function (d) {
	                    return y(d.y) + 6;
	                });
	        }
	        function rect(rect) {
	            rect
	                .attr("x", function (d) {
	                    return x(d.x0);
	                })
	                .attr("y", function (d) {
	                    return y(d.y0);
	                })
	                .attr("width", function (d) {
	                    return x(d.x1) - x(d.x0);
	                })
	                .attr("height", function (d) {
	                    return y(d.y1) - y(d.y0);
	                })
	                .attr("fill", function (d) {
	                    return '#bbbbbb';
	                });
	        }
	        function foreign(foreign) { /* added */
	            foreign
	                .attr("x", function (d) {
	                    return x(d.x0);
	                })
	                .attr("y", function (d) {
	                    return y(d.y0);
	                })
	                .attr("width", function (d) {
	                    return x(d.x1) - x(d.x0);
	                })
	                .attr("height", function (d) {
	                    return y(d.y1) - y(d.y0);
	                });
	        }
	        function name(d) {
	            return breadcrumbs(d) +
	                (d.parent
	                ? " -  Haz click para volver o haz click en un subprograma para ver sus proyectos"
	                : " - Haz click en un programa para ver sus subprogramas");
	        }
	        function breadcrumbs(d) {
	            var res = "";
	            var sep = " > ";
	            d.ancestors().reverse().forEach(function(i){
	                res += i.data.nombre + sep;
	            });
	            return res
	                .split(sep)
	                .filter(function(i){
	                    return i!== "";
	                })
	                .join(sep);
	        }
		}

	}
	
})();