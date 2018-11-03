(function(){
	'use strict';
	
	angular
		.module("corruptionApp")
		.factory("TourFactory", TourFactory)

		function TourFactory(){
			return { 
				department: '',
				territorial_entity:'',
				program:'',
				subprogram:''
			};
		}
	
	
})();
