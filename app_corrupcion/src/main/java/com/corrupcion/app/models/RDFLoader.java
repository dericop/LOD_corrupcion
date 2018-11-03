package com.corrupcion.app.models;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;

public class RDFLoader {
	
	private Model model;
	
	public RDFLoader() {
		model = ModelFactory.createDefaultModel();
	}
	
	public boolean loadRDF()
	{
		try
		{
			model.read("static/datasets/RDF/result.rdf");
		}
		catch(Exception e) {
			System.out.println(e.getMessage());
			return false;
		}
		return true;
	}
	
	public boolean loadRDFContratos() {
		try
		{
			model.read("static/datasets/RDF/resultContratos.rdf");
		}
		catch(Exception e) {
			System.out.println(e.getMessage());
			return false;
		}
		return true;
	}
	
	public Model getModel() {
		return model;
	}
}
