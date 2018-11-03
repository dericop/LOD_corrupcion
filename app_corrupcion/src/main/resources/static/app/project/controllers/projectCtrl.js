(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('projectController', projectController);

	projectController.$inject = ["$scope", "TourFactory", "$state", "$http", "GralFactory"];
	
	function projectController($scope, TourFactory, $state, $http, GralFactory){

		var that = this;
		
		that.makeChart = makeChart;
		that.initialize = initialize;

		initialize();

		function initialize(){
			$http({
				method: "GET",
				url: "app/contratos",
				params: {proyecto: TourFactory.project}
			}).then(function success(response){
				console.log(response)
				makeChart(response.data.results.bindings);
			}, function error(response){
				console.log("something went wrong");
				console.log(response);
			});
		}

		function makeChart(raw_data){

			var es_ES = {
			        "decimal": ",",
			        "thousands": ".",
			        "grouping": [3],
			        "currency": ["€", ""],
			        "dateTime": "%a %b %e %X %Y",
			        "date": "%d/%m/%Y",
			        "time": "%H:%M:%S",
			        "periods": ["AM", "PM"],
			        "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
			        "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
			        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
			};

			d3.timeFormatDefaultLocale(es_ES);

			console.log(raw_data);

			var monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

			for(var i in raw_data)
				raw_data[i] = type(raw_data[i]);

			function type(d){		

				d.name = d.objetoDelContrato.value;

				d.start_date = makeDate(d.fechaInicioEjecucionContrato.value);

				var raw_p = d.plazoEjecucionContrato.value;
				var sep_i = raw_p.indexOf(" ");
				var cant = +raw_p.slice(0,sep_i);
				var ud = raw_p.slice(sep_i+1, raw_p.length).toLowerCase();

				if(ud == "meses")
					d.end_date = new Date(d.start_date.getFullYear(), d.start_date.getMonth() + cant, d.start_date.getDate());
				else
					d.end_date = new Date(d.start_date.getFullYear(), d.start_date.getMonth(), d.start_date.getDate() + cant);

				d.amount = +d.cuantiaDefinitiva.value;

				var raw_type = d.origenRecursos.value;

				if(raw_type == "Presupuesto Nacional/Territorial")
					d.type = "nacional";
				if(raw_type == "No aparece")
					d.type = "no_aparece";
				if(raw_type == "SGP")
					d.type = "SGP";
				if(raw_type == "Recursos propios")
					d.type = "propios";

				return d;
			}

			function makeDate(dateString){
				var day = +dateString.slice(0,2);
				var lastSep = dateString.indexOf(" de ", 6);
				var monthStr = dateString.slice(6,lastSep)
				var month = monthNames.indexOf(monthStr);
				var year = dateString.slice(lastSep+4, dateString.length);
				return new Date(year, month, day);
			}

			var canvas_left_edge = $('#chart-canvas').offset().left;
	        var canvas_width = $('#chart-canvas').width();
	        var amountScale;

	        var data = raw_data

            // Compute the height our canvas needs to be once we get the data
            var number_of_bars = data.length
            var bar_height = 15;
            var bar_margin_bottom = 5;
            var container_top_padding = 30;
            var container_bottom_padding = 40;
            var canvas_height = number_of_bars * (bar_height + bar_margin_bottom) + container_top_padding + container_bottom_padding;

            $('#chart-canvas').css('height',canvas_height)



            function getDate(date) {
                return new Date(date);
            }

            function accessStartDate(d) { return getDate(d['start_date']); }
            function accessEndDate(d) { return getDate(d['end_date']); }

            // Find min/max of our dates
            var min = d3.min(data, accessStartDate);
            var max = d3.max(data, accessEndDate);

            var xScale = d3.scaleTime()
	                .domain([min,max])
	                .range([125, canvas_width]);

            // This creates an axis. You can see that it assign's the scale we made up above
            var xAxis = d3.axisBottom(xScale);

            // Create svg container
            var svg = d3.select("#svg-canvas")
                    .append("svg")
                    .attr("width", canvas_width)
                    .attr("height", canvas_height);


            // Bottom Axis
            var btmAxis = svg.append("g")
                .attr("transform", "translate(0,"+(canvas_height - 25)+")")
                .attr("class", "axis")
                .call(xAxis);

            // Top Axis
            var topAxis = svg.append("g")
                .attr("transform", "translate(0,0)")
                .attr("class", "axis")
                .call(xAxis);

            // Lines
            var line = svg.append("g")
                .selectAll("line")
                    .data(xScale.ticks(10))
              .enter().append("line")
                .attr("x1", xScale)
                .attr("x2", xScale)
                .attr("y1", 30)
                .attr("y2", canvas_height-50)
                .style("stroke", "#ccc");

            var div = d3.select("body").append("div")	
    									.attr("class", "tooltip")				
    									.style("opacity", 0);

    		var format = d3.format(",");

    		function moneyFormat(d){
    			return "$"+format(d);
    		}

            $.each(data, function(index, value){
                var start_pixels = xScale(getDate(value['start_date']))
                var bar_width = xScale(getDate(value['end_date'])) - start_pixels

                var new_bar = $("<div></div>").addClass("bar-wrapper "+value['type']).attr("data-name", value['name']).attr("data-start_date", getDate(value['start_date']).getTime()).attr("data-end_date", getDate(value['start_date']).getTime()).attr("data-amount", value['amount']);
                var new_bar_bar = $("<div></div>").addClass("bar").css("margin-left", start_pixels+"px").css("width", bar_width+"px");
                var new_bar_name = $("<div></div>").addClass("bar-name").html(value['name']);
                new_bar_bar.append(new_bar_name);
                new_bar_bar.mouseover(function(e){
                	div.transition()		
		                .duration(200)		
		                .style("opacity", .9);		
		            div.html("<p>"+value['name']+"</p><p>"+value.nombreORazonSocial.value+"</p><p>"+moneyFormat(value['amount'])+"</p>")	
		                .style("left", (e.pageX - 100) + "px")		
		                .style("top", (e.pageY - 28) + "px");
                })
            	new_bar_bar.mouseout(function(){
            		div.transition()		
		                .duration(200)		
		                .style("opacity", 0);
            	})
            	new_bar_bar.click(function(){
            		$scope.contract = value.contrato.value;
        			TourFactory.contract = $scope.contract;
  					GralFactory.contractsIsEnabled = true;
  					$scope.$apply();  					
	    			nextView();
            	})
                new_bar.append(new_bar_bar);
                /*
                var new_bar = '<div class="bar-wrapper '+value['type']+'" data-name="'+value['name']+'" data-start_date="'+getDate(value['start_date']).getTime()+'" data-end_date="'+getDate(value['end_date']).getTime()+'" data-amount="'+value['amount']+'">\
                    <div class="bar" style="margin-left:'+start_pixels+'px;width:'+bar_width+'px;">\
                        <div class="bar-name">'+value['name']+'</div>\
                    </div>\
                </div>'*/
                $('#gantt-bar-container').append(new_bar)
            })

            function nextView(){
				GralFactory.onepage.moveDown();
			}


            var amount_extent = d3.extent(data, function(d){return Number(d['amount'])})            

            var amts = data.map(function(d){ return +d.amount; });

            // Make the scale
            amountScale = d3.scaleLog()
                .domain(amount_extent)
                .range([0,5]);

            // Color scale
            var color = d3.scaleLinear()
            				.domain(amount_extent)
            				.range(["#9CD6C6","#136D54"]);



            var $container = $('#gantt-bar-container');
            $container.isotope({
              itemSelector : '.bar-wrapper',
              animationEngine : 'jquery',
              getSortData : {
                  name : function ( $elem ) {
                      return $elem.attr('data-name');
                  },
                  start_date : function ( $elem ) {
                      return parseInt($elem.attr('data-start_date'))
                  },
                  end_date : function ( $elem ) {
                      return parseInt($elem.attr('data-end_date'))
                  },
                  amount: function ( $elem ) {
                      return parseInt($elem.attr('data-amount'))
                  }
              }
            });

            function rstH(){
            	$("#gantt-bar-container").height(canvas_height-30);
            }

            $container.on('arrangeComplete', rstH);

	        // Sorting buttons
	        // So let's make a simple sort_ascending boolean variable and set it to true
	        var sort_ascending = true;

	        $("#gantt-bar-container").height(canvas_height-30);

	        $('#sorter li a').click(function(e){
	            // Set it to what it ain't
	            sort_ascending = !sort_ascending

	            var sorter_selector = $(this).attr('data-sorter');
	            // When we update the isotope layout, it has a property called sortAscending that will then get our value
	            $('#gantt-bar-container').isotope({ sortBy : sorter_selector, sortAscending: sort_ascending }).on('arrangeComplete', rstH);

	        });

	        // Filter buttons
	        $('#filter li a').click(function(e){
	        	var filter_selector = $(this).attr('data-filter');
	          	$('#gantt-bar-container').isotope({ filter: filter_selector }).on('arrangeComplete', rstH);;
	          	return false;
	        });

	        // Color buttons
	        $('#color li a').click(function(){
	          var color_selector = $(this).attr('data-color');
	          // Get all the bars
	          var $bar_wrappers = $('.bar-wrapper');

	          if (color_selector == 'amount'){
	            $.each($bar_wrappers, function(index, bar_wrapper){
	                // Find each div's data amount
	                var this_amount = $(bar_wrapper).attr('data-amount')
	                // Run this through our color scale
	                var new_color_at_index = Math.floor(amountScale(this_amount))
	                $(bar_wrapper).find('.bar').css({'background-color':color(this_amount)});
	                //$(bar_wrapper).find('.bar').css({'background-color':GREENS[new_color_at_index]})
	            });
	          }else{
	            $.each($bar_wrappers, function(index, bar_wrapper){
	                // Reset to the default background color
	                $(bar_wrapper).find('.bar').css({'background-color':''})
	            });
	          }
	          $("#gantt-bar-container").height(canvas_height-30);
	        });
		}

	}
	
})();