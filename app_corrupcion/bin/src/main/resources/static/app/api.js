var app = angular.module('theApp', []);
app.controller('theCtrl', function($scope, $http){
	
	//prueba
	/*$http({
		method: "GET",
		url: "/app"
	}).then(function success(response){
		console.log(response);
		$scope.contrato = response.data;
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//retornar sectores de una entidad
	/*$http({
		method: "GET",
		url: "/app/sectores",
		params: {entidad: "Gobernacion de Caldas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//programas de un sector
	/*$http({
		method: "GET",
		url: "/app/programas",
		params: {sector: "http://corrupcion.com/presupuesto#sectorEducacion"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleccionar subprogramas de un programa
	/*$http({
		method: "GET",
		url: "/app/subprogramas",
		params: {programa: "http://corrupcion.com/presupuesto#ProgramaCoberturaYPermanenciaConEnfoqueEnCierreDeBrechas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleccionar proyectos de un subprograma
	/*$http({
		method: "GET",
		url: "/app/proyectos",
		params: {subprograma: "http://corrupcion.com/presupuesto#SubprogramaAccesoYPermanencia"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleecionar contratos de un proyecto
	$http({
		method: "GET",
		url: "/app/contratos",
		params: {proyecto: "http://corrupcion.com/presupuesto#FortalecimientoDeLosProcesosEtnoeducativosEnElDepartamentoDeCaldas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});
	
	//seleccionar programas y subprogramas 
	/*$http({
		method: "GET",
		url: "/app/programasYSubprogramas",
		params: {sector: "http://corrupcion.com/presupuesto#sectorEducacion"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	})*/
	
	//seleccionar proyectos de un subprograma con recursos propios, transferencias, totales y ejecutados
	/*$http({
		method: "GET",
		url: "/app/proyectosPresupuesto",
		params: {subprograma: "http://corrupcion.com/presupuesto#SubprogramaAccesoYPermanencia"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleccionar los contratos de la gobernacion
	/*$http({
		method: "GET",
		url: "/app/contratosGobernacion",
		params: {gobernacion: "Gobernacion de Caldas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	//seleccionar los contratos de un municipio
	/*$http({
		method: "GET",
		url: "/app/contratosMunicipio",
		params: {municipio: "Aguadas"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	
});