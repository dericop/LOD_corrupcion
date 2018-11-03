var corruptionApp = angular.module('corruptionApp', [
	'app.controllers',
	'ui.router'
]);

angular.module('app.controllers', []);

corruptionApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('');
    $locationProvider.hashPrefix('');

    $stateProvider
    		.state('home',{
    			url: '',
    			views:{
    				'start':{
    					templateUrl: 'app/home/partial-home.html',
    	            		controller:'homeController',
    	            		controllerAs:'homeCtrl'
    				},
    				'explanation':{
    					templateUrl: 'app/explanation/partial-explanation.html',
    	            		controller:'explController',
    	            		controllerAs:'explCtrl'
    				},
    				'department':{
    					templateUrl: 'app/department/partial-department.html',
    			        controller:'deptoController',
    			        controllerAs:'deptoCtrl'
    				},
    				'territorial_entity':{
    					templateUrl: 'app/territorial_entity/partial-territorial.html',
    		            controller:'territorialEntityController',
    		            controllerAs:'terEntCtrl'
    				},
                    'sector':{
                        templateUrl: 'app/sector/partial-sector.html',
                        controller:'sectorController',
                        controllerAs:'sectorCtrl'
                    },
    				'program':{
    					templateUrl: 'app/program/partial-program.html',
    		            controller:'programController',
                        controllerAs:'programCtrl'
    				},
    				'subprogram':{
    					templateUrl: 'app/subprogram/partial-subprogram.html',
    		            controller:'subprogramController',
                        controllerAs:'subprogramCtrl'
    				},
                    'project':{
                        templateUrl: 'app/project/partial-project.html',
                        controller:'projectController',
                        controllerAs:'projectCtrl'
                    },
    				'contracts':{
    					templateUrl: 'app/contracts/partial-contracts.html',
    					controller:'contractController',
    		            controllerAs: 'contractCtrl'
    				}
    			}
    		});
});



