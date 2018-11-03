(function(){
	'use strict';
	
	angular
		.module('corruptionApp')
		.controller('homeController', homeController);
	
	homeController.$inject = ["$scope", "GralFactory"];
	
	function homeController($scope, GralFactory){
		
		var that = this;
		that.getTourExplanation = getTourExplanation;
		that.getTourStart = getTourStart;
		that.nextView = nextView;
		that.restartHomeView = restartHomeView;
		that.showCollaborators = showCollaborators;
		that.nextCollaborators = nextCollaborators;
		that.currrentCollaborator = 0;
		that.collaborators = [
			{
				class_name:"col-daniel",
				name:"Daniel E. Rico Posada",
				rol:"Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas"
			},
			{
				class_name:"col-medina",
				name:"Luis Daniel Medina",
				rol:"Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas"
			}, 
			{
				class_name:"col-pablo",
				name:"Juan Pablo Castaño",
				rol:"Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas"
			},
			{
				class_name:"col-gustavo",
				name:"Gustavo Isaza",
				rol:"PhD. Ingeniería Informática-Ingeniería de Software. Profesor Asociado Universidad de Caldas"
			},
			{
				class_name:"col-luis",
				name:"Luis Fernando Castillo",
				rol:"PhD. Informática y Automática. Decano de la facultad de Ingeniería de la Universidad de Caldas"
			},
			{
				class_name:"col-nestor",
				name:"Nestor Castaño",
				rol:"PhD. Informática. Decano de la facultad de Ingeniería de la Universidad de Manizales"
			},
			{
				class_name:"col-juan",
				name:"Juan Piedrahita",
				rol:"Abogado. Profesor de la Universidad de Manizales"
			},
			{
				class_name:"col-jairo",
				name:"Jairo Iván Vélez Bedoya",
				rol:"Magister en Gestión y Desarrollo de Proyectos de Software. Profesor de la facultad de Ingeniería de la Universidad de Caldas"
			},
			{
				class_name:"col-angie",
				name:"Angie Lorena Diaz",
				rol:"Estudiante de último semestre de Diseño Visual en la Universidad de Caldas"
			},
			{
				class_name:"col-luz",
				name:"Luz Adriana Vélez Galvis",
				rol:"Coordinadora de Proyectos de la Secretaría de Educación"
			}];
		

		function getTourExplanation(){
			$(".tour-expl").velocity(
				{ left: "98px" },
				{ 	
					animation:"easeInSine",
					complete:function(){
						$(".expl-left-decorator").velocity({opacity:1}, "easeInSine");
						$(".expl-right-decorator").velocity({opacity:1}, "easeInSine");
						
						GralFactory.explanationIsEnabled = true;
						$scope.$apply();
						
						setTimeout(function(){
							nextView();
						}, 1000)
						
						setTimeout(function(){
							restartHomeView();
						}, 2000)
					}
				}
			);

			$(".tour-start").velocity({right: "-900px"}, "easeInSine");


		}

		function getTourStart(){
			$(".tour-expl").velocity({ left: "-900px" }, "easeInSine");
			$(".tour-start").velocity({right: "76px"}, 
				{
					animation:"easeInSine",
					complete:function(){
						$(".start-left-decorator").velocity({opacity:1}, "easeInSine");
						$(".start-right-decorator").velocity({opacity:1}, "easeInSine");
						
						
						GralFactory.explanationIsEnabled = true;
						GralFactory.departmentIsEnabled = true;
						GralFactory.entityIsEnabled = true;
						
						$scope.$apply();
						
						setTimeout(function(){
							GralFactory.onepage.moveTo(3);
						}, 1000);
						
						setTimeout(function(){
							restartHomeView();
						}, 1500)
					}
				});	
		}
		
		function restartHomeView(){
			$(".tour-expl").removeAttr("style");
			$(".tour-start").removeAttr("style");
			$(".start-left-decorator").removeAttr("style");
			$(".start-right-decorator").removeAttr("style");
			$(".expl-left-decorator").removeAttr("style");
			$(".expl-right-decorator").removeAttr("style");
		}
		
		function showCollaborators(){
			that.currrentCollaborator = 0;
			
			swal({
			  title: 'Equipo de trabajo',
			  width: 800,
			  padding: 90,
			  html:
				  '<div class="modal-collaborators">'+
				  	'<div class="coll-left-btn prevCol"></div>'+
				  	'<div class="coll-right-btn nextCol"></div>'+
				  	''+
				  	'<div>'+
				  		'<div id="slot1" class="col-daniel"></div>'+
				  		'<p id="c1-name" class="coll-name">Daniel E. Rico Posada</p>'+
				  		'<p id="c1-desc" class="coll-description">Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas</p>'+
				  	'</div>'+
				  	'<div>'+
					  	'<div id="slot2" class="col-medina"></div>'+
				  		'<p id="c2-name" class="coll-name">Luis Daniel Medina</p>'+
				  		'<p id="c2-desc" class="coll-description">Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas</p>'+
				  	'</div>'+
				  	'<div>'+
					  	'<div id="slot3" class="col-pablo"></div>'+
				  		'<p id="c3-name" class="coll-name">Juan Pablo Castaño</p>'+
				  		'<p id="c3-desc" class="coll-description">Estudiante de Ingeniería de Sistemas y Computación de la Universidad de Caldas</p>'+
				  	'</div>'+
				  	
				  '</div>',
			  showCloseButton: false,
			  showCancelButton: false,
			  showConfirmButton:false,
			  focusConfirm: false,
			});
			
			$(".nextCol").click(function(){
				nextCollaborators();
			});
			
			$(".prevCol").click(function(){
				prevCollaborators();
			})
		}
		
		function nextView(){
			GralFactory.onepage.moveDown();
		}
		
		function nextCollaborators(){
			
			if(that.currrentCollaborator+3 < that.collaborators.length){
				that.currrentCollaborator+=3;
				$("#slot1").removeClass();
				$("#slot2").removeClass();
				$("#slot3").removeClass();
				$("#c1-name").html("");
				$("#c1-desc").html("");
				$("#c2-name").html("");
				$("#c2-desc").html("");
				$("#c3-name").html("");
				$("#c3-desc").html("");
				
				var c1 = that.collaborators[that.currrentCollaborator];
				var c2 = that.collaborators[that.currrentCollaborator+1];
				var c3 = that.collaborators[that.currrentCollaborator+2];
				
				
				
				if(c1){
					$("#slot1").addClass(c1.class_name);
					$("#c1-name").html(c1.name);
					$("#c1-desc").html(c1.rol);
				}
				
				if(c2){
					$("#slot2").addClass(c2.class_name);
					$("#c2-name").html(c2.name);
					$("#c2-desc").html(c2.rol);
				}
				
				if(c3){
					$("#slot3").addClass(c3.class_name);
					$("#c3-name").html(c3.name);
					$("#c3-desc").html(c3.rol);
				}
			}
		}
		
		function prevCollaborators(){
			if(that.currrentCollaborator-3 >= 0){
				that.currrentCollaborator-=3;
				$("#slot1").removeClass();
				$("#slot2").removeClass();
				$("#slot3").removeClass();
				
				var c1 = that.collaborators[that.currrentCollaborator];
				var c2 = that.collaborators[that.currrentCollaborator+1];
				var c3 = that.collaborators[that.currrentCollaborator+2];
				
				if(c1){
					$("#slot1").addClass(c1.class_name);
					$("#c1-name").html(c1.name);
					$("#c1-desc").html(c1.rol);
				}
				
				if(c2){
					$("#slot2").addClass(c2.class_name);
					$("#c2-name").html(c2.name);
					$("#c2-desc").html(c2.rol);
				}
				
				if(c3){
					$("#slot3").addClass(c3.class_name);
					$("#c3-name").html(c3.name);
					$("#c3-desc").html(c3.rol);
				}
			}
			
		}

	}
	
})();