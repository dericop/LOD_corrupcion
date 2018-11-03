package com.corrupcion.app.controllers;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.corrupcion.app.models.*;

@RestController
public class AppController {
	
	//contratos de datos abiertos
	private final boolean contratosDA = true;
	
	@RequestMapping("/app")
	public Programa experimental() {
		Programa programa = new Programa("nombre", 0, 0);
		return programa;
	}
	
	@RequestMapping("/app/sectores")
	public ArrayList<Sector> sectores(@RequestParam(value="entidad") String entidad) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		ArrayList<Sector> result = qe.getSectores(entidad);
		return result;
	}
	
	@RequestMapping("/app/programas")
	public String programas(@RequestParam(value="sector") String sector) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		String result = qe.getProgramas(sector);
		return result;
	}
	
	@RequestMapping("/app/subprogramas")
	public String subprogramas(@RequestParam(value="programa") String programa) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		String result = qe.getSubprogramas(programa);
		return result;
	}
	
	@RequestMapping("/app/proyectos")
	public String proyectos(@RequestParam(value="subprograma") String subprograma) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		String result = qe.getProyectos(subprograma);
		return result;
	}
	
	@RequestMapping("/app/contratos")
	public String contratos(@RequestParam(value="proyecto") String proyecto) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		String result = qe.getContratos(proyecto);
		return result;
	}
	
	@RequestMapping("/app/contrato")
	public String contrato(@RequestParam(value = "contrato") String contrato) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		String result = qe.getContrato(contrato);
		return result;
	}
	
	@RequestMapping("/app/programasYSubprogramas")
	public ArrayList<Programa> programasYSubprogramas(@RequestParam(value="sector") String sector) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		ArrayList<Programa> result = qe.getProgramasConSubprogramas(sector);
		return result;
	}
	
	@RequestMapping("/app/proyectosPresupuesto")
	public ArrayList<Proyecto> proyectosPresupuesto(@RequestParam(value="subprograma") String subprograma) {
		QueryExecuter qe = new QueryExecuter(!contratosDA);
		ArrayList<Proyecto> result = qe.getProyectosConPresupuesto(subprograma);
		return result;
	}
	
	@RequestMapping("/app/contratosGobernacion")
	public String contratosGobernacion(@RequestParam(value="gobernacion") String gobernacion) {
		QueryExecuter qe = new QueryExecuter(contratosDA);
		String result = qe.getContratosGobernacion(gobernacion);
		return result;
	}
	
	@RequestMapping("/app/contratosMunicipio")
	public String contratosMunicipio(@RequestParam(value="municipio") String municipio) {
		QueryExecuter qe = new QueryExecuter(contratosDA);
		String result = qe.getContratosMunicipio(municipio);
		return result;
	}
	
}
