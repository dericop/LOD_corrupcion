package com.corrupcion.app.models;

import java.util.ArrayList;

public class Programa implements Comparable<Programa>{
    
    private String nombre;
    private long presupuestoRecursosPropios;
    private long presupuestoTransferencia;
    private ArrayList<Subprograma> subprogramas;
    private String uri;
    private long presupuestoTotal;
    private long presupuestoEjecutado;
    
    public Programa(String nombre, long presupuestoRecursos, long presupuestoTransferencia){
        this.nombre = nombre;
        this.presupuestoRecursosPropios = presupuestoRecursos;
        this.presupuestoTransferencia = presupuestoTransferencia;
        this.presupuestoTotal = presupuestoRecursos + presupuestoTransferencia;
        this.subprogramas = new ArrayList<>();
    }

    public String getNombre() {
        return nombre;
    }

    public long getPresupuestoRecursosPropios() {
        return presupuestoRecursosPropios;
    }

    public long getPresupuestoTransferencia() {
        return presupuestoTransferencia;
    }
    
    public long getPresupuestoEjecutado() {
		return presupuestoEjecutado;
	}
    
    public long getPresupuestoTotal() {
		return presupuestoTotal;
	}

    public ArrayList<Subprograma> getSubprogramas() {
        return subprogramas;
    }
    
    
    
    public void addSubprograma(Subprograma s){
        this.subprogramas.add(s);
    }
    
    public String getUri() {
		return uri;
	}
    
    public void setUri(String uri) {
		this.uri = uri;
	}
    
    public void setPresupuestoEjecutado(long presupuestoEjecutado) {
		this.presupuestoEjecutado = presupuestoEjecutado;
	}
    
    public void calculatePresupuestoEjecutado() {
    	for(Subprograma s: this.subprogramas) {
    		this.presupuestoEjecutado += s.getPresupuestoEjecutado();
    	}
    }

    @Override
    public String toString() {
        return this.nombre + " - " + this.presupuestoRecursosPropios + " + " + this.presupuestoTransferencia + "\n" + this.subprogramas.toString();
    }

    @Override
    public int compareTo(Programa o) {
        return this.nombre.compareTo(o.nombre);
    }

    
   
     
}
