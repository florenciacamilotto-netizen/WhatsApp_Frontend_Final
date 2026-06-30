import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useRequest from '../hooks/useRequest';
import {
    getWorkspaces,
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
    loading: false,
    error: null,
    refetch: () => {},
    crearGrupo: async () => {},
    editarGrupo: async () => {},
    eliminarGrupo: async () => {},
    invitarMiembro: async () => {},
    degradarme: async () => {},
    abandonarGrupo: async () => {},
    expulsarMiembro: async () => {}
});

export const WorkspacesContextProvider = () => {
    const { sendRequest, loading, response, error } = useRequest();
    const [workspaces, setWorkspaces] = useState([]);

    const fetchWorkspaces = async () => {
        const res = await sendRequest(getWorkspaces);
        if (res?.data?.workspaces) setWorkspaces(res.data.workspaces);
    };

    // Cargar workspaces al montar
    React.useEffect(() => { fetchWorkspaces(); }, []);

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

    const providerValue = {
        workspaces,
        loading,
        error,
        refetch: fetchWorkspaces,
        crearGrupo,
        editarGrupo,
        eliminarGrupo,
        invitarMiembro,
        degradarme,
        abandonarGrupo,
        expulsarMiembro
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
