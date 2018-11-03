(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('breadcrumpCtrl', ['$scope', "GralFactory", function($scope, GralFactory) {
			
			var that = this;
			that.previousView = previousView;
			
			function previousView(index){
				console.log(GralFactory.homeIsEnabled);
				
				switch(index){
					case 1:
						GralFactory.homeIsEnabled = true;
						break;
				}
				
				setTimeout(function(){
					GralFactory.onepage.moveUp();
				},100)
				
				console.log(GralFactory.homeIsEnabled);
				
			}
		  
		}])
		
		.directive('breadcrump', function() {
			  return {
				restrict: 'E',
				replace: true,
				scope:{
					label1:"@",
					link1:"@",
					label2:"@",
					link2:"@",
					explanation:"@"
				},
			    template: '<div class="breadcrump"><div class="breadcrumo-container"><div class="breadcrump-decorator"></div><div class="breadcrump-right-decorator"></div><div class="breadcrump-data"><a ui-sref="home"><h4>{{label1}}</h4></a> <a ui-sref="department"><h4>{{label2}}</h4></a></div></div><div class="top-info"><p>{{explanation}}</p></div></div>'
			  };
		});
	
})();