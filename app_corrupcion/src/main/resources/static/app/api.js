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
	
	
	//seleecionar contratos de un proyecto
	$http({
		method: "GET",
		url: "/app/contratos",
		params: {proyecto: "http://corrupcion.com/presupuesto#ImplementaciónDeEstrategiasDeAccesoYPermanenciaAlSistemaEducativoDelDepartamento"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});
	
	//seleccionar detalle de un contrato
	/*$http({
		method: "GET",
		url: "/app/contrato",
		params: {contrato: "http://corrupcion.com/presupuesto#contratoExistente_23022017-0056_2016-17000-0054_30"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	
	
	//seleccionar programas y subprogramas con presupuesto recursos propios, transferencias y ejecutado de un sector dado
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
		params: {subprograma: "http://corrupcion.com/presupuesto#ExcelenciaDocente"}
	}).then(function success(response){
		console.log(response);
	}, function error(response){
		console.log("something went wrong");
		console.log(response);
	});*/
	
	
	
	
	//visualizaciones GIT
	
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