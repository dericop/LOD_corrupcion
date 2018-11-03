(function(){
	'use strict';
	
	angular
	.module('corruptionApp')
	.controller('contractController', contractController);

	contractController.$inject = ["$scope", "TourFactory", "$state", "$http", "GralFactory"];
	
	
	function contractController($scope, TourFactory, $state, $http, GralFactory){
		
		var that = this;
		
		that.initialize = initialize;
		that.showContract = showContract;
		
		that.initialize();
		
		that.contrato = {};
		
		function initialize(){
			$http({
				method: "GET",
				url: "app/contrato",
				params: {contrato: TourFactory.contract}
			}).then(function success(response){
				console.log(response);
				that.showContract(response.data.results.bindings[0]);
			}, function error(response){
				console.log("something went wrong");
				console.log(response);
			});
		}
		
		function showContract(data){
			if(data == undefined) return;
			that.contrato["bpid"] = data.bpid.value;
			that.contrato["causal"] = data.causal.value;
			that.contrato["clase"] = data.clase.value;
			that.contrato["correoElectronicoContacto"] = data.correoElectronicoContacto.value;
			that.contrato["cuantiaAContratar"] = data.cuantiaAContratar.value;
			that.contrato["cuantiaDefinitiva"] = data.cuantiaDefinitiva.value;
			that.contrato["departamentoContratista"] = data.departamentoContratista.value;
			that.contrato["departamentoEjecucion"] = data.departamentoEjecucion.value;
			that.contrato["destinacionGasto"] = data.destinacionGasto.value;
			that.contrato["estadoContrato"] = data.estadoContrato.value;
			that.contrato["estadoProceso"] = data.estadoProceso.value;
			that.contrato["familia"] = data.familia.value;
			that.contrato["fechaFirmaContrato"] = data.fechaFirmaContrato.value;
			that.contrato["fechaInicioEjecucionContrato"] = data.fechaInicioEjecucionContrato.value;
			that.contrato["grupo"] = data.grupo.value;
			that.contrato["identificacionRepresentanteLegalContratista"] = data.identificacionRepresentanteLegalContratista.value;
			that.contrato["municipioEjecucion"] = data.municipioEjecucion.value;
			that.contrato["nitContratista"] = data.nitContratista.value;
			that.contrato["nombreORazonSocial"] = data.nombreORazonSocial.value;
			that.contrato["numeroProceso"] = data.numeroProceso.value;
			that.contrato["objetoDelContrato"] = data.objetoDelContrato.value;
			that.contrato["origenRecursos"] = data.origenRecursos.value;
			that.contrato["paisContratista"] = data.paisContratista.value;
			that.contrato["plazoEjecucionContrato"] = data.plazoEjecucionContrato.value;
			that.contrato["regimenDeContratacion"] = data.regimenDeContratacion.value;
			that.contrato["representanteContratista"] = data.representanteContratista.value;
			that.contrato["segmento"] = data.segmento.value;
			that.contrato["tipoContrato"] = data.tipoContrato.value;
			that.contrato["tipoProceso"] = data.tipoProceso.value;
			that.contrato["valorContratosInterventoriaExterna"] = data.valorContratosInterventoriaExterna.value;
		}
		
	}
	
})();