(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('explController', explController);
	
	explController.$inject = ["$scope", "GralFactory"];
	
	function explController($scope, GralFactory){
		var that = this;
		that.nextView = nextView;
		
		function nextView(){
			
			GralFactory.departmentIsEnabled = true;
			setTimeout(function(){
				GralFactory.onepage.moveDown();
			}, 100)
			
		}

		

	}
	
})();