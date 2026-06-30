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

// GET /api/workspace — Lista los grupos del usuario autenticado
export async function getWorkspaces() {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener los espacios de trabajo");
    return response;
}

// POST /api/workspace — Crear un nuevo grupo
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

// PUT /api/workspace/:id — Editar nombre o descripción del grupo (Dueño o Admin)
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

// DELETE /api/workspace/:id — Eliminar el grupo (solo Dueño)
export async function deleteWorkspace(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al eliminar el espacio de trabajo");
    return response;
}

// POST /api/workspace/:id/members — Invitar un usuario al grupo (solo Dueño)
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

// PUT /api/workspace/:id/members/me/downgrade — Admin renuncia a su rol
export async function downgradeSelf(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/me/downgrade`, {
        method: 'PUT',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al cambiar de rol");
    return response;
}

// DELETE /api/workspace/:id/members/me — Abandonar el grupo (Admin o Usuario)
export async function leaveWorkspace(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/me`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al abandonar el grupo");
    return response;
}

// DELETE /api/workspace/:id/members/:member_id — Expulsar a un miembro (solo Dueño)
export async function kickMember(workspace_id, member_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}/members/${member_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al expulsar al miembro");
    return response;
}
