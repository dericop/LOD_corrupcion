(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('territorialEntityController', territorialEntityController);

	territorialEntityController.$inject = ["$scope", "TourFactory", "$state", "GralFactory"];
	
	function territorialEntityController($scope, TourFactory, $state, GralFactory){
		var that = this;
		that.goToGob = goToGob;
		that.nextView = nextView;
		
		function goToGob(){
			TourFactory.department = 'Caldas';
			nextView();
		}
		
		function nextView(){
			GralFactory.onepage.moveDown();
		}
		
	}
	
})();