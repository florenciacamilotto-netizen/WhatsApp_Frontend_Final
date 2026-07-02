import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

function getAuthHeaders() {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    if (!token) throw new Error("No hay un token de sesión activo");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// (GET) /api/workspace // // LISTAR LOS GRUPOS DEL USUARIO //

export async function getWorkspaces() {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener los espacios de trabajo");
    return response;
}

// (GET) /api/workspace/members/me/invitations // // LISTAR LAS INVITACIONES PENDIENTES DEL USUARIO //
export async function getMyPendingInvitations() {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/members/me/invitations`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener las invitaciones pendientes");
    return response;
}

// (PUT) /api/workspace/:id/members/me/Aceptado // // ACEPTAR UNA INVITACIÓN //
export async function acceptInvitation(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/me/Aceptado`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al aceptar la invitación");
    return response;
}

// (PUT) /api/workspace/:id/members/me/Rechazado // // RECHAZAR UNA INVITACIÓN //
export async function rejectInvitation(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/me/Rechazado`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al rechazar la invitación");
    return response;
}

// (GET) /api/workspace/:id/members // // LISTAR LOS MIEMBROS QUE ACEPTARON FORMAR PARTE DEL GRUPO //
export async function getWorkspaceMembers(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener los miembros del grupo");
    return response;
}

// (POST) /api/workspace // // CREAR UN NUEVO GRUPO //
export async function createWorkspace(nombre, descripcion = '') {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nombre, descripcion })
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al crear el espacio de trabajo");
    return response;
}

// (PUT) /api/workspace/:id // // (DUEÑO) EDITAR EL NOMBRE O DESCRIPCIÓN DEL GRUPO //
export async function updateWorkspace(workspace_id, nombre, descripcion) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nombre, descripcion })
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al actualizar el espacio de trabajo");
    return response;
}

// (DELETE) /api/workspace/:id // // (DUEÑO) ELIMINAR EL GRUPO //
export async function deleteWorkspace(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al eliminar el espacio de trabajo");
    return response;
}

// (POST) /api/workspace/:id/members // (DUEÑO) INVITAR A UN USUARIO AL GRUPO //
export async function inviteMember(workspace_id, invited_email, role = 'Usuario') {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ invited_email, role })
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al invitar al usuario");
    return response;
}

// (DELETE) /api/workspace/:id/members/me // (USUARIO) ABANDONAR UN GRUPO //
export async function leaveWorkspace(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/me`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al abandonar el grupo");
    return response;
}
