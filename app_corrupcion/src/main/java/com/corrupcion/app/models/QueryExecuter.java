package com.corrupcion.app.models;

import org.apache.jena.query.QueryFactory;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.*;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import com.corrupcion.app.models.*;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class QueryExecuter extends RDFLoader{

	
	public QueryExecuter(boolean contratos) {
		super();
		if(contratos) {
			loadRDFContratos();
		}
		else
		{
			loadRDF();
		}
		
	}
	
	public ArrayList<Sector> getSectores(String entidad) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"Select ?sector ?nombreSector\r\n" + 
				"WHERE{\r\n" + 
				"	?entidad rdfs:label ?nombre.\r\n" + 
				"	?entidad vc:tieneSector ?sector.\r\n" + 
				"	?sector rdfs:label ?nombreSector.\r\n" + 
				"   FILTER regex(?nombre, \"" + entidad + "\", \"i\")" +
				"}";
		Query query = QueryFactory.create(queryString);
		
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			List<QuerySolution> resultList = ResultSetFormatter.toList(result);
			return iterateSectores(resultList);
		}
		catch(Exception e) {
			throw e;
		}
		
	}
	
	public String getProgramas(String sector) {
		String queryString = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" +
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"Select ?programa ?nombrePrograma ?presupuestoRP ?presupuestoTransferencia\r\n" + 
				"WHERE{\r\n" + 
				"	<" +sector +"> vc:define ?programa.\r\n" + 
				"    ?programa rdfs:label ?nombrePrograma;\r\n" +
				"    		   vc:tieneRecursosPropiosPrograma ?presupuestoRP;\r\n"+
				"              vc:tieneTransferenciasPrograma ?presupuestoTransferencia.\r\n"+
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
		
	}
	
	public String getSubprogramas(String programa) {
		String queryString = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" +
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"Select ?subprograma ?nombreSubprograma ?presupuestoRP ?presupuestoTransferencia\r\n" + 
				"WHERE{\r\n" + 
				"	<" + programa + "> vc:divideEn ?subprograma.\r\n" + 
				"	?subprograma rdfs:label ?nombreSubprograma;\r\n" + 
				"				 vc:tieneRecursosPropiosSubprograma ?presupuestoRP;\r\n" + 
				"				 vc:tieneTransferenciasSubprograma ?presupuestoTransferencia.\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public String getProyectos(String subprograma) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"Select ?proyecto ?nombreProyecto ?bpid ?presupuestoRP ?presupuestoTransferencias\r\n" + 
				"WHERE{ \r\n" + 
				"	<" + subprograma + "> vc:seEjecutaAtravesDe ?proyecto.\r\n" + 
				"	?proyecto rdfs:label ?nombreProyecto; \r\n" + 
				"				 vc:seIdentificaCon ?bpid; \r\n" + 
				"				 vc:tieneRecursos ?presupuestoRP;\r\n" + 
				"				 vc:tieneTransferencias ?presupuestoTransferencias.\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public ArrayList<Programa> getProgramasConSubprogramas(String sector){
		ArrayList<Programa> programas;
		String queryString = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" +
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"Select ?programa ?nombrePrograma ?presupuestoRP ?presupuestoTransferencia\r\n" + 
				"WHERE{\r\n" + 
				"	<" +sector +"> vc:define ?programa.\r\n" + 
				"    ?programa rdfs:label ?nombrePrograma;\r\n" +
				"    		   vc:tieneRecursosPropiosPrograma ?presupuestoRP;\r\n"+
				"              vc:tieneTransferenciasPrograma ?presupuestoTransferencia.\r\n"+
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe =  QueryExecutionFactory.create(query, getModel())){
	            ResultSet result = qe.execSelect();
	            
	            List<QuerySolution> resultList = ResultSetFormatter.toList(result);
	            programas = iterateProgramas(resultList);
	            return programas;
	            
        }
        catch(Exception e) {
        	throw e;
        }
	}
	
	public ArrayList<Proyecto> getProyectosConPresupuesto(String subprograma){
		ArrayList<Proyecto> proyectos = new ArrayList<>();
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?proyecto ?nombreProyecto ?recursos ?transferencias ?proyectoBPID\r\n" + 
				"WHERE{\r\n" + 
				"	<" + subprograma + "> vc:seEjecutaAtravesDe ?proyecto.\r\n" + 
				"	?proyecto rdfs:label ?nombreProyecto;\r\n" + 
				"              vc:tieneRecursos ?recursos; \r\n" +
				"              vc:tieneTransferencias ?transferencias;\r\n" +
				"	           vc:seIdentificaCon ?proyectoBPID.\r\n" +
				"}\r\n";
		Query query = QueryFactory.create(queryString);
		Proyecto proyecto;
		long cuantiaSum;
		try(QueryExecution qe =  QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			List<QuerySolution> resultList = ResultSetFormatter.toList(result);
			for(QuerySolution qs: resultList) {
				proyecto = new Proyecto(qs.getLiteral("nombreProyecto").getString(), qs.getLiteral("recursos").getLong(), qs.getLiteral("transferencias").getLong(), qs.getLiteral("proyectoBPID").getString());
				proyectos.add(proyecto);
				cuantiaSum = contratosSumProyecto(proyecto.getBPID());
				proyecto.setPresupuestoEjecutado(cuantiaSum);
				proyecto.setUri(qs.getResource("proyecto").getURI());
			}
			
			return proyectos;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public String getContratosGobernacion(String gobernacion) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?nombre ?cantidad\r\n" + 
				"WHERE{\r\n" + 
				"	?gobernacion rdfs:label ?nombreGobernacion.\r\n" + 
				"	?gobernacion vc:contratoGobernacion ?contrato.\r\n" + 
				"	?contrato vc:nombreContratista ?nombre;\r\n" + 
				"			  vc:valorCuantiaDefinitiva ?cantidad.\r\n" + 
				"	FILTER regex(?nombreGobernacion, \"" + gobernacion + "\", \"i\")\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public String getContratosMunicipio(String municipio) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?entidad ?cantidad\r\n" + 
				"WHERE\r\n" + 
				"{\r\n" + 
				"	?municipio rdfs:label ?nombreMunicipio.\r\n" + 
				"	?municipio vc:contratoMunicipio ?contrato.\r\n" + 
				"	?contrato vc:nombreContratista ?entidad;\r\n" + 
				"			  vc:valorCuantiaDefinitiva ?cantidad.\r\n" + 
				"	FILTER regex(?nombreMunicipio, \"" + municipio + "\", \"i\")\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public String getContratos(String proyecto) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT DISTINCT ?contrato ?BPID ?numeroProceso ?tipoProceso ?estadoProceso ?causal ?regimenDeContratacion ?grupo ?segmento ?familia ?clase ?cuantiaAContratar ?tipoContrato ?departamentoEjecucion ?municipioEjecucion ?correoElectronicoContacto ?estadoContrato ?objetoDelContrato ?cuantiaDefinitiva ?nombreORazonSocial ?nitContratista ?paisContratista ?departamentoContratista ?representanteContratista ?identificacionRepresentanteLegalContratista ?valorContratosInterventoriaExterna ?fechaFirmaContrato ?fechaInicioEjecucionContrato ?plazoEjecucionContrato ?destinacionGasto ?origenRecursos\r\n" + 
				"WHERE{\r\n" + 
				"	<" + proyecto + "> vc:tieneContrato ?contrato.\r\n" + 
				"	?contrato vc:tieneBPID ?BPID;\r\n" + 
				"			vc:tieneNumeroProceso ?numeroProceso;\r\n" + 
				"			vc:tieneTipoProceso ?tipoProceso;\r\n" + 
				"			vc:tieneEstadoProceso ?estadoProceso;\r\n" + 
				"			vc:tieneCausal ?causal;\r\n" + 
				"			vc:tieneRegimenContratacion ?regimenDeContratacion;\r\n" + 
				"			vc:tieneGrupo ?grupo;\r\n" + 
				"			vc:tieneSegmento ?segmento;\r\n" + 
				"			vc:tieneFamilia ?familia;\r\n" + 
				"			vc:tieneClase ?clase;\r\n" + 
				"			vc:tieneCuantiaAContratar ?cuantiaAContratar;\r\n" + 
				"			vc:tieneTipoContrato ?tipoContrato;\r\n" + 
				"			vc:ejecutadoEnDepartamento ?departamentoEjecucion;\r\n" + 
				"			vc:ejecutadoEnMunicipio ?municipioEjecucion;\r\n" + 
				"			vc:correoContacto ?correoElectronicoContacto;\r\n" + 
				"			vc:estadoDelContrato ?estadoContrato;\r\n" + 
				"			vc:conObjeto ?objetoDelContrato;\r\n" + 
				"			vc:valorCuantiaDefinitiva ?cuantiaDefinitiva;\r\n" + 
				"			vc:nombreContratista ?nombreORazonSocial;\r\n" + 
				"			vc:NitDelcontratista ?nitContratista;\r\n" + 
				"			vc:paisDelContratista ?paisContratista;\r\n" + 
				"			vc:departamentoDelContratista ?departamentoContratista;\r\n" + 
				"			vc:representanteDelContratista ?representanteContratista;\r\n" + 
				"			vc:identificacionRepresentanteLegalContratista ?identificacionRepresentanteLegalContratista;\r\n" + 
				"			vc:conValorDeContratosDeInterventoriaExterna ?valorContratosInterventoriaExterna;\r\n" + 
				"			vc:firmadoEl ?fechaFirmaContrato;\r\n" + 
				"			vc:iniciaEjecucion ?fechaInicioEjecucionContrato;\r\n" + 
				"			vc:plazoDeEjecucion ?plazoEjecucionContrato;\r\n" + 
				"			vc:tieneDestinacionGasto ?destinacionGasto;\r\n" + 
				"			vc:tieneOrigenRecursos ?origenRecursos\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	public String getContrato(String contrato) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?bpid ?numeroProceso ?tipoProceso ?estadoProceso ?causal ?regimenDeContratacion ?grupo ?segmento ?familia ?clase ?cuantiaAContratar ?tipoContrato ?departamentoEjecucion ?municipioEjecucion ?correoElectronicoContacto ?estadoContrato ?objetoDelContrato ?cuantiaDefinitiva ?nombreORazonSocial ?nitContratista ?paisContratista ?departamentoContratista ?representanteContratista ?identificacionRepresentanteLegalContratista ?valorContratosInterventoriaExterna ?fechaFirmaContrato ?fechaInicioEjecucionContrato ?plazoEjecucionContrato ?destinacionGasto ?origenRecursos\r\n" + 
				"WHERE{\r\n" + 
				"	<" +contrato + "> vc:tieneBPID ?bpid;\r\n" + 
				"			vc:tieneNumeroProceso ?numeroProceso;\r\n" + 
				"			vc:tieneTipoProceso ?tipoProceso;\r\n" + 
				"			vc:tieneEstadoProceso ?estadoProceso;\r\n" + 
				"			vc:tieneCausal ?causal;\r\n" + 
				"			vc:tieneRegimenContratacion ?regimenDeContratacion;\r\n" + 
				"			vc:tieneGrupo ?grupo;\r\n" + 
				"			vc:tieneSegmento ?segmento;\r\n" + 
				"			vc:tieneFamilia ?familia;\r\n" + 
				"			vc:tieneClase ?clase;\r\n" + 
				"			vc:tieneCuantiaAContratar ?cuantiaAContratar;\r\n" + 
				"			vc:tieneTipoContrato ?tipoContrato;\r\n" + 
				"			vc:ejecutadoEnDepartamento ?departamentoEjecucion;\r\n" + 
				"			vc:ejecutadoEnMunicipio ?municipioEjecucion;\r\n" + 
				"			vc:correoContacto ?correoElectronicoContacto;\r\n" + 
				"			vc:estadoDelContrato ?estadoContrato;\r\n" + 
				"			vc:conObjeto ?objetoDelContrato;\r\n" + 
				"			vc:valorCuantiaDefinitiva ?cuantiaDefinitiva;\r\n" + 
				"			vc:nombreContratista ?nombreORazonSocial;\r\n" + 
				"			vc:NitDelcontratista ?nitContratista;\r\n" + 
				"			vc:paisDelContratista ?paisContratista;\r\n" + 
				"			vc:departamentoDelContratista ?departamentoContratista;\r\n" + 
				"			vc:representanteDelContratista ?representanteContratista;\r\n" + 
				"			vc:identificacionRepresentanteLegalContratista ?identificacionRepresentanteLegalContratista;\r\n" + 
				"			vc:conValorDeContratosDeInterventoriaExterna ?valorContratosInterventoriaExterna;\r\n" + 
				"			vc:firmadoEl ?fechaFirmaContrato;\r\n" + 
				"			vc:iniciaEjecucion ?fechaInicioEjecucionContrato;\r\n" + 
				"			vc:plazoDeEjecucion ?plazoEjecucionContrato;\r\n" + 
				"			vc:tieneDestinacionGasto ?destinacionGasto;\r\n" + 
				"			vc:tieneOrigenRecursos ?origenRecursos\r\n" + 
				"}";
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe = QueryExecutionFactory.create(query, getModel())){
			ResultSet result = qe.execSelect();
			String json = resultsToJson(result);
			return json;
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	private long contratosSum(String queryString) {
		long cuantiaSum;
		Query query = QueryFactory.create(queryString);
		try(QueryExecution qe2 = QueryExecutionFactory.create(query, getModel())){
			//System.out.println(proyecto.getBPID());
			ResultSet result2 = qe2.execSelect();
			List<QuerySolution> queryList = ResultSetFormatter.toList(result2);
			cuantiaSum = 0;
			for(QuerySolution qs2:queryList) {
				cuantiaSum += qs2.getLiteral("cuantia").getLong();
			}
			return cuantiaSum;
			
			
		}
		catch(Exception e) {
			throw e;
		}
	}
	
	private long contratosSumProyecto(String bpid) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
			"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
			"SELECT ?cuantia\r\n" + 
			"WHERE{\r\n" + 
			"	?proyecto vc:tieneContrato ?contrato.\r\n" + 
			"	?contrato vc:valorCuantiaDefinitiva ?cuantia;\r\n" + 
			"			  vc:tieneBPID ?bpid.\r\n" + 
			"	FILTER REGEX(?bpid, \"" + bpid + "\", \"i\")\r\n" + 
			"}";
		return contratosSum(queryString);
	}
	
	private long contratosSumSubprograma(String subprograma) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?cuantia\r\n" + 
				"WHERE{\r\n" + 
				"	<" + subprograma + "> vc:seEjecutaAtravesDe ?proyecto.\r\n" + 
				"	?proyecto vc:tieneContrato ?contrato.\r\n" + 
				"	?contrato vc:valorCuantiaDefinitiva ?cuantia\r\n" + 
				"}";
		return contratosSum(queryString);
	}
	
	private long contratosSumPrograma(String programa) {
		String queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
				"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
				"SELECT ?cuantia\r\n" + 
				"WHERE{\r\n" + 
				"	<" + programa + "> vc:divideEn ?subprograma.\r\n" + 
				"	?subprograma vc:seEjecutaAtravesDe ?proyecto.\r\n" + 
				"	?proyecto vc:tieneContrato ?contrato.\r\n" + 
				"	?contrato vc:valorCuantiaDefinitiva ?cuantia\r\n" + 
				"}";
		return contratosSum(queryString);
	}
	
	private ArrayList<Programa> iterateProgramas(List<QuerySolution> queryResult){
		Programa programa;
		String queryString;
		ArrayList<Programa> programas = new ArrayList<>();
		Subprograma subprograma;
		String subprogramaUri;
		for(QuerySolution solution : queryResult) {
        	//System.out.println(solution);
        	programa = new Programa(solution.getLiteral("nombrePrograma").getString(), solution.getLiteral("presupuestoRP").getLong(), solution.getLiteral("presupuestoTransferencia").getLong());
        	programas.add(programa);
        	queryString = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
    				"PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" +
    				"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
    				"Select ?subprograma ?nombreSubprograma ?presupuestoRP ?presupuestoTransferencia\r\n" + 
    				"WHERE{\r\n" + 
    				"	<" + solution.getResource("programa").getURI() + "> vc:divideEn ?subprograma.\r\n" + 
    				"	?subprograma rdfs:label ?nombreSubprograma;\r\n" + 
    				"				 vc:tieneRecursosPropiosSubprograma ?presupuestoRP;\r\n" + 
    				"				 vc:tieneTransferenciasSubprograma ?presupuestoTransferencia.\r\n" + 
    				"}";
        	Query internalQuery = QueryFactory.create(queryString);
        	try(QueryExecution qe2 = QueryExecutionFactory.create(internalQuery, getModel())) {
        		ResultSet internalResult = qe2.execSelect();
        		List<QuerySolution> internalResultList = ResultSetFormatter.toList(internalResult);
        		for(QuerySolution internalSolution: internalResultList) {
        			subprogramaUri = internalSolution.getResource("subprograma").getURI();
        			subprograma = new Subprograma(internalSolution.getLiteral("nombreSubprograma").getString(), Long.valueOf(internalSolution.getLiteral("presupuestoRP").getString()), Long.valueOf(internalSolution.getLiteral("presupuestoTransferencia").getString()));
        			subprograma.setUri(subprogramaUri);
        			subprograma.setPresupuestoEjecutado(contratosSumSubprograma(subprogramaUri));
        			programa.addSubprograma(subprograma);
        			
        		}
        		programa.calculatePresupuestoEjecutado();
        		
        	}
        	catch(Exception e) {
        		throw e;
        	}
        	
        }
		return programas;
	}
	
	private ArrayList<Sector> iterateSectores(List<QuerySolution> resultList){
		Sector sector;
		ArrayList<Sector> listaSectores = new ArrayList<>();
		String queryString;
		Programa programa;
		String programaUri;
		String sectorUri;
		for(QuerySolution solution : resultList) {
			sector = new Sector(solution.getLiteral("nombreSector").getString());
			sectorUri = solution.getResource("sector").getURI();
			sector.setUri(sectorUri);
			listaSectores.add(sector);
			queryString = "PREFIX vc: <http://corrupcion.com/presupuesto#>\r\n" + 
					"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n" + 
					"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\r\n" + 
					"SELECT ?programa ?programaNombre ?recursosPropios ?transferencias\r\n" + 
					"WHERE{\r\n" + 
					"	<" + sectorUri + "> vc:define ?programa.\r\n" + 
					"	?programa rdfs:label ?programaNombre;\r\n" + 
					"				vc:tieneRecursosPropiosPrograma ?recursosPropios;\r\n" + 
					"				vc:tieneTransferenciasPrograma ?transferencias\r\n" + 
					"}";
			Query internalQuery = QueryFactory.create(queryString);
			try(QueryExecution qe2 = QueryExecutionFactory.create(internalQuery, getModel())){
				ResultSet internalResult = qe2.execSelect();
        		List<QuerySolution> internalResultList = ResultSetFormatter.toList(internalResult);
        		for(QuerySolution internalSolution: internalResultList) {
        			programaUri = internalSolution.getResource("programa").getURI();
        			programa = new Programa(internalSolution.getLiteral("programaNombre").getString(), internalSolution.getLiteral("recursosPropios").getLong(), internalSolution.getLiteral("transferencias").getLong());
        			programa.setUri(programaUri);
        			programa.setPresupuestoEjecutado(contratosSumPrograma(programaUri));
        			sector.addPrograma(programa);
        			
        		}
        		sector.calculatePresupuestoEjecutado();
			}
			catch(Exception e) {
				throw e;
			}
		}
		return listaSectores;
			
	}
	 
	private String resultsToJson(ResultSet result) {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		ResultSetFormatter.outputAsJSON(outputStream, result);
		String json = new String(outputStream.toByteArray());
		return json;
		
	}
	
	
}
