import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useRequest from '../hooks/useRequest';
import {
    getWorkspaces,
    getMyPendingInvitations,
    acceptInvitation,
    rejectInvitation,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    downgradeSelf,
    leaveWorkspace,
    kickMember
} from '../services/workspaceService';

export const WorkspacesContext = createContext({
    workspaces: [],
    invitaciones: [],
    loading: false,
    error: null,
    refetch: () => {},
    crearGrupo: async () => {},
    editarGrupo: async () => {},
    eliminarGrupo: async () => {},
    invitarMiembro: async () => {},
    degradarme: async () => {},
    abandonarGrupo: async () => {},
    expulsarMiembro: async () => {},
    aceptarInvitacion: async () => {},
    rechazarInvitacion: async () => {}
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
            // No rompemos la pantalla si falla; simplemente no se muestran invitaciones
            console.error('Error al obtener invitaciones pendientes:', e.message);
        }
    };

    // Cargar workspaces e invitaciones al montar
    React.useEffect(() => {
        fetchWorkspaces();
        fetchInvitaciones();
    }, []);

    // Actualizar lista desde response del hook
    React.useEffect(() => {
        if (response?.data?.workspaces) setWorkspaces(response.data.workspaces);
    }, [response]);

    // --- Acciones ---

    async function crearGrupo(nombre, descripcion) {
        const res = await createWorkspace(nombre, descripcion);
        await fetchWorkspaces();
        return res;
    }

    async function editarGrupo(workspace_id, nombre, descripcion) {
        const res = await updateWorkspace(workspace_id, nombre, descripcion);
        await fetchWorkspaces();
        return res;
    }

    async function eliminarGrupo(workspace_id) {
        const res = await deleteWorkspace(workspace_id);
        await fetchWorkspaces();
        return res;
    }

    async function invitarMiembro(workspace_id, email, role) {
        return await inviteMember(workspace_id, email, role);
    }

    async function degradarme(workspace_id) {
        const res = await downgradeSelf(workspace_id);
        await fetchWorkspaces();
        return res;
    }

    async function abandonarGrupo(workspace_id) {
        const res = await leaveWorkspace(workspace_id);
        await fetchWorkspaces();
        return res;
    }

    async function expulsarMiembro(workspace_id, member_id) {
        return await kickMember(workspace_id, member_id);
    }

    async function aceptarInvitacion(workspace_id) {
        const res = await acceptInvitation(workspace_id);
        // Saco la invitación de la lista local y refresco los grupos (ahora va a aparecer ahí)
        setInvitaciones(prev => prev.filter(inv => inv.workspace_id !== workspace_id));
        await fetchWorkspaces();
        return res;
    }

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
        degradarme,
        abandonarGrupo,
        expulsarMiembro,
        aceptarInvitacion,
        rechazarInvitacion
    };

    return (
        <WorkspacesContext.Provider value={providerValue}>
            <Outlet />
        </WorkspacesContext.Provider>
    );
};

// Hook de acceso rápido
export function useWorkspaces() {
    return useContext(WorkspacesContext);
}

