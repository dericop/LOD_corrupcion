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
				entityIsEnabled : true,
				sectorIsEnabled : true,
				resourcesIsEnabled : true,
				programIsEnabled : true,
				subprogramIsEnabled : true,
				projectIsEnabled : true,
				contractsIsEnabled : true,
			};
		}
	
})();
