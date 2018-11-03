package com.corrupcion.app.models;

import java.util.ArrayList;

public class Proyecto {
    
    private String nombre;
    private long presupuestoRecursosPropios;
    private long presupuestoTransferencias;
    private String BPID;
    private ArrayList<Contrato> contratos;
    private String uri;
    private long presupuestoTotal;
    private long presupuestoEjecutado;
    
    public Proyecto(String nombre, long presupuestoRecursosProyecto, long presupuestoTransferencia, String BPID){
        this.nombre = nombre;
        this.presupuestoRecursosPropios = presupuestoRecursosProyecto;
        this.presupuestoTransferencias = presupuestoTransferencia;
        this.BPID = BPID;
        this.contratos = new ArrayList<>();
        this.presupuestoTotal = presupuestoRecursosProyecto + presupuestoTransferencias;
        this.presupuestoEjecutado = 0;
    }

    public String getBPID() {
        return BPID;
    }

    public String getNombre() {
        return nombre;
    }

    public long getPresupuestoRecursosPropios() {
        return presupuestoRecursosPropios;
    }

    public long getPresupuestoTransferencias() {
        return presupuestoTransferencias;
    }

    public ArrayList<Contrato> getContratos() {
        return contratos;
    }
    
    public void addContrato(Contrato contrato){
        this.contratos.add(contrato);
    }
    
    public String getUri() {
		return uri;
	}
    
    public long getPresupuestoEjecutado() {
		return presupuestoEjecutado;
	}
    
    public long getPresupuestoTotal() {
		return presupuestoTotal;
	}
    
    public void setPresupuestoEjecutado(long presupuestoEjecutado) {
		this.presupuestoEjecutado = presupuestoEjecutado;
	}
    
    public void setUri(String uri) {
		this.uri = uri;
	}
    
}
