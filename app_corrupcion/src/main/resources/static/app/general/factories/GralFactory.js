(function(){
	'use strict';
	
	angular
		.module("corruptionApp")
		.factory("GralFactory", GralFactory)

		function GralFactory(){
			return {
				onepage:$(".gen-container"),
				homeIsEnabled: true,
				explanationIsEnabled : false,
				departmentIsEnabled : false,
				entityIsEnabled : false,
				sectorIsEnabled : false,
				programIsEnabled : false,
				subprogramIsEnabled : false,
				projectIsEnabled : false,
				contractsIsEnabled : true,
			};
		}
	
})();
