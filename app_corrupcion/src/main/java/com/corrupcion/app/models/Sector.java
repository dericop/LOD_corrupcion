package com.corrupcion.app.models;

import java.util.ArrayList;

public class Sector {
	
	private String nombre;
	private long presupuestoTotal;
	private long presupuestoEjecutado;
	private ArrayList<Programa> programasSector;
	private String uri;
	
	public Sector(String nombre) {
		this.nombre = nombre;
		this.programasSector = new ArrayList<>();
		this.presupuestoEjecutado = 0;
		this.presupuestoTotal = 0;
	}
	
	public String getNombre() {
		return nombre;
	}
	
	public long getPresupuestoTotal() {
		return presupuestoTotal;
	}
	
	public ArrayList<Programa> getProgramasSector() {
		return programasSector;
	}
	
	public long getPresupuestoEjecutado() {
		return presupuestoEjecutado;
	}
	
	public String getUri() {
		return uri;
	}
	
	public void setUri(String uri) {
		this.uri = uri;
	}
	
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	
	public void setPresupuestoTotal(long presupuestoTotal) {
		this.presupuestoTotal = presupuestoTotal;
	}
	
	public void setProgramasSector(ArrayList<Programa> programasSector) {
		this.programasSector = programasSector;
	}
	
	
	public void addPrograma(Programa programa) {
		this.programasSector.add(programa);
	}
	
	public void setPresupuestoEjecutado(long presupuestoEjecutado) {
		this.presupuestoEjecutado = presupuestoEjecutado;
	}
	
	public void calculatePresupuestoEjecutado() {
		for(Programa programa: this.programasSector) {
			this.presupuestoEjecutado += programa.getPresupuestoEjecutado();
			this.presupuestoTotal += programa.getPresupuestoRecursosPropios() + programa.getPresupuestoTransferencia();
			
		}
	}

}
