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
			console.log("Prueba");
			
			$scope.department = 'Caldas';
			TourFactory.department = $scope.department;
			GralFactory.sectorIsEnabled = true;
			
			setTimeout(function(){
				nextView();
			});
			
		}
		
		function nextView(){
			GralFactory.onepage.moveDown();
		}
		
	}
	
})();