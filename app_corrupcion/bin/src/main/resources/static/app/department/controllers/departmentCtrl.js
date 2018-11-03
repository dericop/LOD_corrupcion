(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('deptoController', deptoController);
	
	deptoController.$inject = ["$scope", "TourFactory", "$state", "GralFactory"];
	
	function deptoController($scope, TourFactory, $state, GralFactory){
		$scope.depto = "Caldas";
		
		var that = this;
		that.nextView = nextView;
		that.mainColor = '#127b5f';
		that.mainHover = 'rgba(18, 123, 95, 0.68)';
		that.caldasG_ref = "";
		
		
		var width = 490,
	    height = 580,
	    centered;

		// Define color scale
		var color = d3.scaleLinear()
		  .domain([1, 20])
		  .clamp(true)
		  .range(['#fff', '#999']);
	
		var projection = d3.geoMercator()
		  .scale(1900)
		  // Center the Map in Colombia
		  .center([-74, 4])
		  .translate([width / 2, height / 2]);
	
		var path = d3.geoPath()
		  .projection(projection);
	
		// Set svg width & height
		var svg = d3.select('svg')
		  .attr('width', width)
		  .attr('height', height);
	
		// Add background
		svg.append('rect')
		  .attr('class', 'background')
		  .attr('width', width)
		  .attr('height', height)
		  .on('click', clicked);
	
		var g = svg.append('g');
	
		var effectLayer = g.append('g')
		  .classed('effect-layer', true);
	
		var mapLayer = g.append('g')
		  .classed('map-layer', true);
	
		var dummyText = g.append('text')
		  .classed('dummy-text', true)
		  .attr('x', 10)
		  .attr('y', 30)
		  .style('opacity', 0);
	
		var bigText = g.append('text')
		  .classed('big-text', true)
		  .attr('x', 20)
		  .attr('y', 45);
	
		// Load map data
		d3.json('../../../assets/Colombia.geo.json', function(error, mapData) {
		  var features = mapData.features;
	
		  // Update color scale domain based on data
		  color.domain([0, d3.max(features, nameLength)]);
	
		  // Draw each province as a path
		  
		  mapLayer.selectAll('path')
		      .data(features)
		      .enter().append('path')
		      .attr('d', path)
		      .attr('vector-effect', 'non-scaling-stroke')
		      .style('fill', fillFn)
		      .style('stroke', '#0003')
		      .on('mouseover', mouseover)
		      .on('mouseout', mouseout)
		      .on('click', clicked);
		  
		  //Colorear a Caldas
		  that.caldasG_ref = document.getElementById("map").childNodes[1].childNodes[1].childNodes[5];
		  that.caldasG_ref.style["fill"] = that.mainColor;
		  
		});
	
		// Get province name
		function nameFn(d){
		  return d && d.properties ? d.properties.NOMBRE_DPT : null;
		}
	
		// Get province name length
		function nameLength(d){
		  var n = nameFn(d);
		  return n ? n.length : 0;
		}
	
		// Get province color
		function fillFn(d){
		  return color(nameLength(d));
		}
	
		// When clicked, zoom in
		function clicked(d) {
		  var x, y, k;
	
		  // Compute centroid of the selected path
		  if (d && centered !== d) {
		    var centroid = path.centroid(d);
		    x = centroid[0];
		    y = centroid[1];
		    k = 4;
		    centered = d;
		  } else {
		    x = width / 2;
		    y = height / 2;
		    k = 1;
		    centered = null;
		  }
	
		  // Highlight the clicked province
		 /*mapLayer.selectAll('path')
		    .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});*/
		  
		  if($scope.depto == 'Caldas'){
			  that.caldasG_ref.style["fill"] = that.mainHover;
			  TourFactory.department = $scope.depto;
			  
			  GralFactory.entityIsEnabled = true;
			  
			  swal({
				  position: 'top-right',
				  type: 'success',
				  title: 'Has Seleccionado Caldas',
				  showConfirmButton: false,
				  timer: 2000
			  }).then((result) => {
				  nextView();
			  })
		  }
			  
		  // Zoom
		  /*g.transition()
		    .duration(750)
		    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');*/
		}
	
		function mouseover(d){
		  // Highlight hovered province
		  d3.select(this).style('fill', 'rgba(0,0,0,.2)');
		  
		  $scope.depto = nameFn(d);
		  $scope.$apply();
		  
		  if($scope.depto == 'Caldas')
			  that.caldasG_ref.style["fill"] = that.mainHover;
			  
		  // Draw effects
		  //textArt(nameFn(d));
		}
	
		function mouseout(d){
		  // Reset province color
		  mapLayer.selectAll('path')
		    .style('fill', function(d){return fillFn(d);});
	
		  // Remove effect text
		  effectLayer.selectAll('text').transition()
		    .style('opacity', 0)
		    .remove();
	
		  // Clear province name
		  bigText.text('');
		  
		  that.caldasG_ref.style["fill"] = that.mainColor;
		}
		
		
		function nextView(){
			GralFactory.onepage.moveDown();
		}
			
	}
	
})();