(function(){
	'use strict';
	
	angular
		.module('app.controllers')
		.controller('GeneralCtrl', GeneralCtrl)
		
	GeneralCtrl.$inject = ["$scope", "GralFactory", "$state"];
	
	function GeneralCtrl($scope, GralFactory){
		
		var that = this;
		that.gralFactory = GralFactory;
		that.disableViews = disableViews;
		that.animateExplanation = animateExplanation;
		
		function disableViews(index){

			/*
			switch(index){
				case 1:
					GralFactory.homeIsEnabled = true;
					GralFactory.explanationIsEnabled = false;
					break;
				case 2:
					//GralFactory.homeIsEnabled = false;
					
					GralFactory.departmentIsEnabled = false;
					
					break;
				case 3:
					//GralFactory.explanationIsEnabled = false;
					GralFactory.entityIsEnabled = false;
					break;
				case 4:
					//GralFactory.departmentIsEnabled = false;
					break;
			}
		
			$scope.$apply();*/

		}
		
		function animateExplanation(){
			animateIns($(".ins1"), function(){
				
				animateOpacity($(".ins2"), function(){
					
					animateIns($(".ins3"), function(){
						
						animateOpacity($(".ins4"), function(){
							
							animateOpacity($(".ins5"), function(){
								
								animateOpacity($(".ins6"), function(){
									
									animateIns($(".ins7"), function(){
										
										animateOpacity($(".ins8"), function(){
											
											animateOpacity($(".ins9"), function(){
												
												animateIns($(".ins10"), function(){
													
													$(".ins10").velocity("callout.shake");
													
												});
												
											});
											
										});
									})
									
								});
								
							});
							
						});
						
					});
					
				});
				
			});
		}
		
		function animateIns(element, callback){
			element.velocity({
				left: "0px"
			},
			{
				duration: 700,
				animation:"easeInSine",
				complete:function(){
					callback();
				}
			});
		}
		
		function animateOpacity(element, callback){
			element.velocity(
			{
				opacity: 1
			},
			{
				duration: 800,
				animation:"easeInSine",
				complete:function(){
					callback();
				}
			})
		}
		
		
		window.disableViews = that.disableViews;
		window.animateExplanation = that.animateExplanation;
	}
	
})();