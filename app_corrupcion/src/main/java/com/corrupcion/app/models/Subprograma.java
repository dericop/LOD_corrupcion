package com.corrupcion.app.models;

import java.util.ArrayList;

public class Subprograma implements Comparable<Subprograma>{
    
    private String nombre;
    private long presupuestoRecursosPropios;
    private long presupuestoTransferencia;
    private ArrayList<Proyecto> proyectos;
    private String uri;
    private long presupuestoEjecutado;
    
    public Subprograma(String nombre, long presupuestoRecursosPropios, long presupuestoTransferencias){
        this.nombre = nombre;
        this.presupuestoRecursosPropios =  presupuestoRecursosPropios;
        this.presupuestoTransferencia = presupuestoTransferencias;
        this.proyectos = new ArrayList<>();
        this.presupuestoEjecutado = 0;
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

    public ArrayList<Proyecto> getProyectos() {
        return proyectos;
    }
    
    public String getUri() {
		return uri;
    }
    
    public long getPresupuestoEjecutado() {
		return presupuestoEjecutado;
	}
    
    public void setUri(String url) {
		this.uri = url;
	}

    @Override
    public int compareTo(Subprograma o) {
        return this.nombre.compareTo(o.nombre);
    }
    
    public void addProyecto(Proyecto p){
        this.proyectos.add(p);
    }

    @Override
    public String toString() {
        return this.nombre + " - " + this.presupuestoRecursosPropios + " - " + this.presupuestoTransferencia;
    }
    
    public void setPresupuestoEjecutado(long presupuestoEjecutado) {
		this.presupuestoEjecutado = presupuestoEjecutado;
	}
    
    
    
    
}
