import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import {
    getWorkspaces,
    getMyPendingInvitations,
    acceptInvitation,
    rejectInvitation,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    leaveWorkspace,
} from '../services/workspaceService';

export const WorkspacesContext = createContext({
    workspaces: [],
    invitaciones: [],
    loading: false,
    error: null,
    refetch: () => { },
    crearGrupo: async () => { },
    editarGrupo: async () => { },
    eliminarGrupo: async () => { },
    invitarMiembro: async () => { },
    abandonarGrupo: async () => { },
    aceptarInvitacion: async () => { },
    rechazarInvitacion: async () => { }
});

export const WorkspacesContextProvider = () => {
    const { sendRequest, loading, response, error } = useRequest();
    const [workspaces, setWorkspaces] = useState([]);
    const [invitaciones, setInvitaciones] = useState([]);

    const fetchWorkspaces = async () => {
        const res = await sendRequest(getWorkspaces);
        if (res?.data?.workspaces) setWorkspaces(res.data.workspaces);
    };

    const fetchInvitaciones = async () => {
        try {
            const res = await getMyPendingInvitations();
            setInvitaciones(res?.data?.invitations || []);
        } catch (e) {
            console.error('Error al obtener invitaciones pendientes:', e.message);
        }
    };

    // CARGAR LOS WORKSPACES E INVITACIONES //
    React.useEffect(() => {
        fetchWorkspaces();
        fetchInvitaciones();
    }, []);

    // ACTUALIZAR LA LISTA DESDE RESPONSE //
    React.useEffect(() => {
        if (response?.data?.workspaces) setWorkspaces(response.data.workspaces);
    }, [response]);

    // CREAR GRUPO //
    async function crearGrupo(nombre, descripcion) {
        const res = await createWorkspace(nombre, descripcion);
        await fetchWorkspaces();
        return res;
    }
    
    // EDITAR GRUPO //
    async function editarGrupo(workspace_id, nombre, descripcion) {
        const res = await updateWorkspace(workspace_id, nombre, descripcion);
        await fetchWorkspaces();
        return res;
    }

    // ELIMINAR GRUPO //
    async function eliminarGrupo(workspace_id) {
        const res = await deleteWorkspace(workspace_id);
        await fetchWorkspaces();
        return res;
    }

    // INVITAR MIEMBRO //
    async function invitarMiembro(workspace_id, email, role) {
        return await inviteMember(workspace_id, email, role);
    }
    
    // ABANDONAR GRUPO //
    async function abandonarGrupo(workspace_id) {
        const res = await leaveWorkspace(workspace_id);
        await fetchWorkspaces();
        return res;
    }

    // ACEPTAR INVITACIÓN //
    async function aceptarInvitacion(workspace_id) {
        const res = await acceptInvitation(workspace_id);
        // REFRESCAR LOS GRUPOS //
        setInvitaciones(prev => prev.filter(inv => inv.workspace_id !== workspace_id));
        await fetchWorkspaces();
        return res;
    }

    // RECHAZAR INVITACIÓN //
    async function rechazarInvitacion(workspace_id) {
        const res = await rejectInvitation(workspace_id);
        setInvitaciones(prev => prev.filter(inv => inv.workspace_id !== workspace_id));
        return res;
    }

    const providerValue = {
        workspaces,
        invitaciones,
        loading,
        error,
        refetch: fetchWorkspaces,
        crearGrupo,
        editarGrupo,
        eliminarGrupo,
        invitarMiembro,
        abandonarGrupo,
        aceptarInvitacion,
        rechazarInvitacion
    };

    return (
        <WorkspacesContext.Provider value={providerValue}>
            <Outlet />
        </WorkspacesContext.Provider>
    );
};

// HOOK DE ACCESO RÁPIDO //
export function useWorkspaces() {
    return useContext(WorkspacesContext);
}