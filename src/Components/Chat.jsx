import React, { useState, useEffect, useContext, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import Profile from './Profile';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles';
import { useWorkspaces } from '../context/WorkspacesContext';
import { AuthContext } from '../context/AuthContext';
import { getMessages, getNewMessages, sendMessage } from '../services/messageService';

// Cada cuánto se consulta al backend por mensajes nuevos (polling)
const POLLING_INTERVAL_MS = 3000;

const AddEmoji = ({ onEmojiSelect }) => {
    const [showPicker, setShowPicker] = useState(false);
    return (
        <div className="emoji-wrapper" style={{ position: 'relative' }}>
            <button
                className="btn-emoji-inside"
                onClick={() => setShowPicker(!showPicker)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                    <title>wds-ic-sticker-smiley</title>
                    <path d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z" fill="currentColor"></path>
                    <path d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z" fill="currentColor"></path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z" fill="currentColor"></path>
                </svg>
            </button>
            {showPicker && (
                <div style={{ position: 'absolute', bottom: '45px', left: '0', zIndex: 1000 }}>
                    <EmojiPicker onEmojiClick={(emojiData) => {
                        onEmojiSelect(emojiData.emoji);
                        setShowPicker(false);
                    }} />
                </div>
            )}
        </div>
    );
};

function Chat({ chat, onVolver }) {
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [listaMensajes, setListaMensajes] = useState([]);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);
    const { abandonarGrupo, expulsarMiembro, degradarme } = useWorkspaces();
    const { userData } = useContext(AuthContext);
    const ultimaFechaRef = useRef(null);
    const intervaloRef = useRef(null);

    const togglePerfil = () => setMostrarPerfil(prev => !prev);
    const cerrarPerfil = () => setMostrarPerfil(false);

    // Determinar si el usuario puede escribir (solo Dueño y Admin)
    const puedeEscribir = chat?.rol === MEMBER_WORKSPACE_ROLES.OWNER ||
                          chat?.rol === MEMBER_WORKSPACE_ROLES.ADMIN;

    // Convierte un mensaje del backend al formato que usa el render de la lista
    function mapearMensaje(msg) {
        return {
            id: msg.message_id,
            texto: msg.message_contenido,
            hora: new Date(msg.message_fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tipo: msg.user_id === userData?.id ? 'sent' : 'received',
            fecha_creacion: msg.message_fecha_creacion
        };
    }

    // Consulta al backend por mensajes posteriores al último que ya tenemos
    async function buscarMensajesNuevos() {
        if (!chat || !ultimaFechaRef.current) return;
        try {
            const res = await getNewMessages(chat.workspace_id, ultimaFechaRef.current);
            const nuevos = res?.data?.messages || [];
            if (nuevos.length > 0) {
                setListaMensajes(prev => [...prev, ...nuevos.map(mapearMensaje)]);
                ultimaFechaRef.current = nuevos[nuevos.length - 1].message_fecha_creacion;
            }
        } catch (e) {
            console.error('Error al buscar mensajes nuevos:', e.message);
        }
    }

    useEffect(() => {
        // Limpiar el polling anterior al cambiar de chat
        if (intervaloRef.current) clearInterval(intervaloRef.current);
        ultimaFechaRef.current = null;

        if (!chat) {
            setListaMensajes([]);
            return;
        }

        setMostrarPerfil(false);

        async function cargarHistorial() {
            try {
                const res = await getMessages(chat.workspace_id);
                const mensajes = res?.data?.messages || [];
                setListaMensajes(mensajes.map(mapearMensaje));
                ultimaFechaRef.current = mensajes.length > 0
                    ? mensajes[mensajes.length - 1].message_fecha_creacion
                    : new Date().toISOString();
            } catch (e) {
                console.error('Error al cargar los mensajes:', e.message);
                setListaMensajes([]);
                ultimaFechaRef.current = new Date().toISOString();
            }
        }

        cargarHistorial().then(() => {
            intervaloRef.current = setInterval(buscarMensajesNuevos, POLLING_INTERVAL_MS);
        });

        return () => {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        };
    }, [chat]);

    const handleEmojiSelect = (emoji) => {
        setNuevoMensaje(prev => prev + emoji);
    };

    const enviarMensaje = async () => {
        if (!puedeEscribir) return;
        if (nuevoMensaje.trim() === '') return;
        const texto = nuevoMensaje;
        setNuevoMensaje('');
        try {
            const res = await sendMessage(chat.workspace_id, texto);
            const mensajeCreado = res?.data?.message;
            if (mensajeCreado) {
                setListaMensajes(prev => [...prev, mapearMensaje(mensajeCreado)]);
                ultimaFechaRef.current = mensajeCreado.message_fecha_creacion;
            }
        } catch (e) {
            alert(e.message);
            setNuevoMensaje(texto);
        }
    };

    const manejarEnter = (e) => {
        if (e.key === 'Enter') enviarMensaje();
    };

    async function handleAbandonar() {
        if (!window.confirm('¿Querés abandonar este grupo?')) return;
        try {
            await abandonarGrupo(chat.workspace_id);
            onVolver();
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleDegradarse() {
        if (!window.confirm('¿Querés dejar de ser Admin y volver a ser Usuario?')) return;
        try {
            await degradarme(chat.workspace_id);
            onVolver();
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }} className={mostrarPerfil ? 'perfil-abierto' : ''}>
            <div className="chat-container" style={{ flex: 1, minWidth: 0 }}>
                {/* ---- HEADER ---- */}
                <div className="chat-header">
                    <button className="btn-volver" onClick={onVolver}>
                        <svg viewBox="0 0 24 24" height="24" width="24" fill="none">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                        </svg>
                    </button>

                    <div className="chat-header_image" onClick={togglePerfil} style={{ cursor: 'pointer' }}>
                        <img src={chat?.imagen || '/foto-grupo.jpg'} alt={chat?.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '100%' }} />
                    </div>

                    <div className="chat-header_info" onClick={togglePerfil} style={{ cursor: 'pointer', flex: 1 }}>
                        <h4>{chat?.nombre || 'Grupo'}</h4>
                        <div className="chat-header_subtitle">
                            <span>
                                {chat?.rol === MEMBER_WORKSPACE_ROLES.OWNER && 'Sos el Dueño · '}
                                {chat?.rol === MEMBER_WORKSPACE_ROLES.ADMIN && 'Sos Admin · '}
                                {chat?.rol === MEMBER_WORKSPACE_ROLES.USER && 'Solo lectura · '}
                                Hacé click para ver la info del grupo
                            </span>
                        </div>
                    </div>

                    {/* Acciones de rol en el header */}
                    <div className="header-icons">
                        {chat?.rol === MEMBER_WORKSPACE_ROLES.ADMIN && (
                            <button title="Dejar de ser Admin" onClick={handleDegradarse}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.75rem', padding: '4px 8px' }}>
                                Renunciar a Admin
                            </button>
                        )}
                        {(chat?.rol === MEMBER_WORKSPACE_ROLES.ADMIN || chat?.rol === MEMBER_WORKSPACE_ROLES.USER) && (
                            <button title="Abandonar grupo" onClick={handleAbandonar}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B80531' }}>
                                <svg viewBox="0 0 24 24" height="20" width="20" fill="currentColor">
                                    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                                </svg>
                            </button>
                        )}
                        <button>
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                <path d="M9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="currentColor"></path>
                            </svg>
                        </button>
                        <button>
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                <path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ---- MENSAJES ---- */}
                <div className="chat-data">
                    <span className="chat-day">Hoy</span>
                    <div className="chat-disclaimer">
                        <div className="chat-disclaimer_contact">
                            <span className="chat-disclaimer_icon">
                                <svg viewBox="0 0 10 12" height="12" width="10" preserveAspectRatio="xMidYMid meet" version="1.1">
                                    <path d="M5.00847986,1.6 C6.38255462,1.6 7.50937014,2.67435859 7.5940156,4.02703389 L7.59911976,4.1906399 L7.599,5.462 L7.75719976,5.46214385 C8.34167974,5.46214385 8.81591972,5.94158383 8.81591972,6.53126381 L8.81591972,9.8834238 C8.81591972,10.4731038 8.34167974,10.9525438 7.75719976,10.9525438 L2.25767996,10.9525438 C1.67527998,10.9525438 1.2,10.4731038 1.2,9.8834238 L1.2,6.53126381 C1.2,5.94158383 1.67423998,5.46214385 2.25767996,5.46214385 L2.416,5.462 L2.41679995,4.1906399 C2.41679995,2.81636129 3.49135449,1.68973395 4.84478101,1.60510326 L5.00847986,1.6 Z M5.00847986,2.84799995 C4.31163824,2.84799995 3.73624912,3.38200845 3.6709675,4.06160439 L3.6647999,4.1906399 L3.663,5.462 L6.35,5.462 L6.35111981,4.1906399 C6.35111981,3.53817142 5.88169076,2.99180999 5.26310845,2.87228506 L5.13749818,2.85416626 L5.00847986,2.84799995 Z" fill="currentColor"></path>
                                </svg>
                            </span>
                            <span>Los mensajes y las llamadas están cifrados de extremo a extremo.</span>
                        </div>
                    </div>

                    {/* Aviso de solo lectura para Usuarios */}
                    {!puedeEscribir && (
                        <div style={{
                            textAlign: 'center', margin: '12px auto',
                            background: 'rgba(0,0,0,0.06)', borderRadius: '8px',
                            padding: '8px 16px', fontSize: '0.82rem', color: '#888',
                            maxWidth: '320px'
                        }}>
                            Solo los Administradores y el Dueño pueden enviar mensajes en este grupo.
                        </div>
                    )}

                    <div className="chat-messages">
                        {listaMensajes.map((msg) => (
                            <div key={msg.id} className={`messages messages-${msg.tipo}`}>
                                <p>{msg.texto}</p>
                                {msg.tipo === 'sent' ? (
                                    <div className="message-check">
                                        <span className="message-time">{msg.hora} </span>
                                        <span aria-hidden="false" aria-label=" Entregado ">
                                            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" fill="none">
                                                <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path>
                                            </svg>
                                        </span>
                                    </div>
                                ) : (
                                    <span className="message-time">{msg.hora}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ---- INPUT (bloqueado para Usuarios) ---- */}
                <div className="chat-input">
                    {puedeEscribir ? (
                        <div className="input-wrapper">
                            <div className="btn-attach">
                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                    <path d="M11 13H5.5C4.94772 13 4.5 12.5523 4.5 12C4.5 11.4477 4.94772 11 5.5 11H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V11H18.5C19.0523 11 19.5 11.4477 19.5 12C19.5 12.5523 19.0523 13 18.5 13H13V18.5C13 19.0523 12.5523 19.5 12 19.5C11.4477 19.5 11 19.0523 11 18.5V13Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <div className="btn-emoji">
                                <AddEmoji onEmojiSelect={handleEmojiSelect} />
                            </div>
                            <input
                                className="search-container_chat"
                                type="text"
                                placeholder="Escribe un mensaje"
                                value={nuevoMensaje}
                                onChange={(e) => setNuevoMensaje(e.target.value)}
                                onKeyDown={manejarEnter}
                            />
                            <button className="btn-send" onClick={enviarMensaje} style={{ cursor: 'pointer' }}>
                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                    <path d="M5.4 19.425C5.06667 19.5583 4.75 19.5291 4.45 19.3375C4.15 19.1458 4 18.8666 4 18.5V14L12 12L4 9.99997V5.49997C4 5.1333 4.15 4.85414 4.45 4.66247C4.75 4.4708 5.06667 4.44164 5.4 4.57497L20.8 11.075C21.2167 11.2583 21.425 11.5666 21.425 12C21.425 12.4333 21.2167 12.7416 20.8 12.925L5.4 19.425Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '14px',
                            color: '#888', fontSize: '0.85rem',
                            borderTop: '1px solid var(--border-color, #e0e0e0)'
                        }}>
                            No tenés permisos para escribir en este grupo
                        </div>
                    )}
                </div>
            </div>

            {mostrarPerfil && (
                <Profile onCerrar={cerrarPerfil} chat={chat} />
            )}
        </div>
    );
}

export default Chat;