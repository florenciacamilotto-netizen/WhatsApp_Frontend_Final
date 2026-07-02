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

// (GET) /api/messages/:workspace_id // // OBTENER HISTORIAL DE MENSAJES DEL GRUPO //
export async function getMessages(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/messages/${workspace_id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener los mensajes");
    return response;
}

// (GET) /api/messages/:workspace_id/new?after=ISO_DATE //
// (POLLING) OBTENER LOS MENSAJES NUEVOS DEL GRUPO //
export async function getNewMessages(workspace_id, after) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/messages/${workspace_id}/new?after=${encodeURIComponent(after)}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al obtener los mensajes nuevos");
    return response;
}

// (POST) /api/messages/:workspace_id // // ENVIAR MENSAJE AL GRUPO //
export async function sendMessage(workspace_id, contenido) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/messages/${workspace_id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ contenido })
    });
    const response = await response_http.json();
    if (!response.ok) throw new Error(response.message || "Error al enviar el mensaje");
    return response;
}