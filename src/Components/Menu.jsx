import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useWorkspaces } from '../context/WorkspacesContext';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles';

function Menu({ onChatClick, darkMode, onToggleDarkMode, esOculto }) {
    const { logout, userData } = useContext(AuthContext);
    const {
        workspaces, loading, error, crearGrupo, invitarMiembro,
        eliminarGrupo, abandonarGrupo, expulsarMiembro, degradarme
    } = useWorkspaces();

    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState('');
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [filtroActivo, setFiltroActivo] = useState('todos');

    // --- Modal Crear Grupo ---
    const [modalCrear, setModalCrear] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevaDesc, setNuevaDesc] = useState('');
    const [emailsInvitados, setEmailsInvitados] = useState(['', '']);
    const [creando, setCreando] = useState(false);
    const [errorCrear, setErrorCrear] = useState('');

    // --- Modal Invitar ---
    const [modalInvitar, setModalInvitar] = useState(false);
    const [workspaceSeleccionado, setWorkspaceSeleccionado] = useState(null);
    const [emailInvitar, setEmailInvitar] = useState('');
    const [rolInvitar, setRolInvitar] = useState(MEMBER_WORKSPACE_ROLES.USER);
    const [invitando, setInvitando] = useState(false);
    const [errorInvitar, setErrorInvitar] = useState('');
    const [successInvitar, setSuccessInvitar] = useState('');

    // --- Filtros ---
    const workspacesFiltrados = workspaces.filter(ws => {
        const nombre = ws.workspace_nombre || ws.nombre || '';
        const coincide = busqueda === '' || nombre.toLowerCase().startsWith(busqueda.toLowerCase());
        if (filtroActivo === 'grupos') return coincide;
        if (filtroActivo === 'todos') return coincide;
        return false;
    });

    // --- Crear grupo ---
    async function handleCrearGrupo() {
        setErrorCrear('');
        if (!nuevoNombre.trim()) return setErrorCrear('El nombre es obligatorio.');
        const emailsValidos = emailsInvitados.filter(e => e.trim() !== '');
        if (emailsValidos.length < 2) return setErrorCrear('Debes invitar al menos 2 usuarios.');
        try {
            setCreando(true);
            const res = await crearGrupo(nuevoNombre.trim(), nuevaDesc.trim());
            const workspace_id = res.data.workspace._id;
            for (const email of emailsValidos) {
                await invitarMiembro(workspace_id, email.trim(), MEMBER_WORKSPACE_ROLES.USER);
            }
            setModalCrear(false);
            setNuevoNombre('');
            setNuevaDesc('');
            setEmailsInvitados(['', '']);
        } catch (e) {
            setErrorCrear(e.message);
        } finally {
            setCreando(false);
        }
    }

    // --- Invitar al grupo ---
    async function handleInvitar() {
        setErrorInvitar('');
        setSuccessInvitar('');
        if (!emailInvitar.trim()) return setErrorInvitar('Ingresá un email.');
        try {
            setInvitando(true);
            await invitarMiembro(workspaceSeleccionado.workspace_id, emailInvitar.trim(), rolInvitar);
            setSuccessInvitar('Invitación enviada con éxito.');
            setEmailInvitar('');
        } catch (e) {
            setErrorInvitar(e.message);
        } finally {
            setInvitando(false);
        }
    }

    // --- Abandonar / eliminar grupo ---
    async function handleAbandonar(ws) {
        if (!window.confirm('¿Seguro que querés abandonar este grupo?')) return;
        try {
            if (ws.rol === MEMBER_WORKSPACE_ROLES.OWNER) {
                await eliminarGrupo(ws.workspace_id);
            } else {
                await abandonarGrupo(ws.workspace_id);
            }
        } catch (e) {
            alert(e.message);
        }
    }

    // Convertir workspace en objeto compatible con Chat
    function abrirChat(ws) {
        onChatClick({
            id: ws.workspace_id,
            nombre: ws.workspace_nombre,
            imagen: '/foto-perfil.png',
            rol: ws.rol,
            workspace_id: ws.workspace_id,
            esGrupo: true
        });
    }

    return (
        <div className={`menu-container ${darkMode ? 'dark-mode' : ''} ${esOculto ? 'menu-oculto' : ''}`}>
            {/* ---- TOPBAR ---- */}
            <div className="menu-topbar">
                <h1>WhatsApp</h1>
                <div className="header-icons">
                    {/* Botón Nuevo Grupo */}
                    <button className="btn-icon" title="Nuevo grupo" onClick={() => setModalCrear(true)}>
                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                            <title>new-chat-outline</title>
                            <path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z" fill="currentColor"></path>
                        </svg>
                    </button>
                    <div className="dropdown-wrapper">
                        <button onClick={() => setMenuAbierto(!menuAbierto)} className="icon-btn">
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                <path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path>
                            </svg>
                        </button>
                        {menuAbierto && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => { onToggleDarkMode(); setMenuAbierto(false); }}>
                                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                                </div>
                                <div className="dropdown-item" onClick={() => { logout(); navigate('/login'); setMenuAbierto(false); }}>
                                    Cerrar sesión
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ---- BUSCADOR ---- */}
            <div className="search-container_menu">
                <div className="search-icon">
                    <svg viewBox="0 0 20 20" height="20" width="20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.36653 4.3664C5.36341 3.36953 6.57714 2.87 8.00012 2.87C9.42309 2.87 10.6368 3.36953 11.6337 4.3664C12.6306 5.36329 13.1301 6.57724 13.1301 8.00062C13.1301 8.57523 13.0412 9.11883 12.8624 9.63057C12.6972 10.1038 12.4733 10.5419 12.1909 10.9444L16.5712 15.3247C16.7454 15.4989 16.8385 15.7046 16.8385 15.9375C16.8385 16.1704 16.7454 16.3761 16.5712 16.5503C16.396 16.7254 16.1866 16.8175 15.948 16.8175C15.7095 16.8175 15.5001 16.7254 15.3249 16.5503L10.9448 12.1906C10.5421 12.4731 10.104 12.697 9.63069 12.8623C9.11895 13.041 8.57535 13.13 8.00074 13.13C6.57736 13.13 5.36341 12.6305 4.36653 11.6336C3.36965 10.6367 2.87012 9.42297 2.87012 8C2.87012 6.57702 3.36965 5.36328 4.36653 4.3664ZM8.00012 4.63C7.06198 4.63 6.26877 4.95685 5.61287 5.61275C4.95698 6.26865 4.63012 7.06186 4.63012 8C4.63012 8.93813 4.95698 9.73134 5.61287 10.3872C6.26877 11.0431 7.06198 11.37 8.00012 11.37C8.93826 11.37 9.73146 11.0431 10.3874 10.3872C11.0433 9.73134 11.3701 8.93813 11.3701 8C11.3701 7.06186 11.0433 6.26865 10.3874 5.61275C9.73146 4.95685 8.93826 4.63 8.00012 4.63Z" fill="currentColor"></path>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar un grupo"
                    className="search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* ---- FILTROS ---- */}
            <div className="filter-container_menu">
                <button className={`btn-filter ${filtroActivo === 'todos' ? 'btn-filter--active' : ''}`} onClick={() => setFiltroActivo('todos')}>Todos</button>
                <button className={`btn-filter ${filtroActivo === 'grupos' ? 'btn-filter--active' : ''}`} onClick={() => setFiltroActivo('grupos')}>Grupos</button>
            </div>

            {/* ---- LISTA DE GRUPOS ---- */}
            {loading && <div className="no-results">Cargando grupos...</div>}
            {error && <div className="no-results" style={{ color: '#B80531' }}>{error}</div>}
            {!loading && workspacesFiltrados.length === 0 && (
                <div className="no-results">No tenés grupos aún. ¡Creá uno!</div>
            )}
            {!loading && workspacesFiltrados.length > 0 && (
                <div className="chats-list">
                    {workspacesFiltrados.map(ws => (
                        <div key={ws.workspace_id} className="chat-panel_menu">
                            <div className="chat-panel_image" onClick={() => abrirChat(ws)} style={{ cursor: 'pointer' }}>
                                <img src="/foto-perfil.png" alt={ws.workspace_nombre} />
                            </div>
                            <div className="chat-panel_text" onClick={() => abrirChat(ws)} style={{ cursor: 'pointer', flex: 1 }}>
                                <div className="chat-panel_superior">
                                    <h3>{ws.workspace_nombre}</h3>
                                    <h5 style={{ fontSize: '0.7rem', color: 'var(--mid-green)', fontWeight: 600 }}>
                                        {ws.rol}
                                    </h5>
                                </div>
                                <div className="chat-panel_inferior">
                                    <p>{ws.workspace_descripcion || 'Sin descripción'}</p>
                                </div>
                            </div>

                            {/* Acciones contextuales según rol */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
                                {ws.rol === MEMBER_WORKSPACE_ROLES.OWNER && (
                                    <button
                                        title="Invitar al grupo"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid-green)' }}
                                        onClick={() => { setWorkspaceSeleccionado(ws); setModalInvitar(true); }}
                                    >
                                        <svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor">
                                            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    title={ws.rol === MEMBER_WORKSPACE_ROLES.OWNER ? 'Eliminar grupo' : 'Abandonar grupo'}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B80531' }}
                                    onClick={() => handleAbandonar(ws)}
                                >
                                    <svg viewBox="0 0 24 24" height="18" width="18" fill="currentColor">
                                        <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== MODAL CREAR GRUPO ===== */}
            {modalCrear && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={{ marginBottom: '17px', paddingLeft: '7px' }}>Nuevo grupo</h3>

                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Nombre del grupo*"
                            value={nuevoNombre}
                            onChange={e => setNuevoNombre(e.target.value)}
                        />
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Descripción (opcional)"
                            value={nuevaDesc}
                            onChange={e => setNuevaDesc(e.target.value)}
                        />

                        <p style={{ fontSize: '0.85rem', marginTop: '7px', marginBottom: '15px', paddingLeft: '7px' }}>Invitar al menos 2 usuarios:</p>
                        {emailsInvitados.map((email, i) => (
                            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                <input
                                    style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                                    type="email"
                                    placeholder={`Email usuario ${i + 1}`}
                                    value={email}
                                    onChange={e => {
                                        const arr = [...emailsInvitados];
                                        arr[i] = e.target.value;
                                        setEmailsInvitados(arr);
                                    }}
                                />
                                {emailsInvitados.length > 2 && (
                                    <button style={styles.btnDanger} onClick={() => setEmailsInvitados(emailsInvitados.filter((_, j) => j !== i))}>✕</button>
                                )}
                            </div>
                        ))}
                        <button
                            className="btnSecondary"
                            style={{ marginTop: '18px', marginBottom: '6px' }}
                            onClick={() => setEmailsInvitados([...emailsInvitados, ''])}
                        >
                            + Agregar otro
                        </button>

                        {errorCrear && <p style={{ color: '#B80531', fontSize: '0.85rem', margin: '8px 0' }}>{errorCrear}</p>}

                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                            <button style={styles.btnPrimary} onClick={handleCrearGrupo} disabled={creando}>
                                {creando ? 'Creando...' : 'Crear grupo'}
                            </button>
                            <button className='btnSecondary' onClick={() => { setModalCrear(false); setErrorCrear(''); }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL INVITAR ===== */}
            {modalInvitar && workspaceSeleccionado && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={{ marginBottom: '12px' }}>Invitar a "{workspaceSeleccionado.workspace_nombre}"</h3>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Email del usuario a invitar"
                            value={emailInvitar}
                            onChange={e => setEmailInvitar(e.target.value)}
                        />
                        <select
                            style={styles.input}
                            value={rolInvitar}
                            onChange={e => setRolInvitar(e.target.value)}
                        >
                            <option value={MEMBER_WORKSPACE_ROLES.USER}>Usuario</option>
                            <option value={MEMBER_WORKSPACE_ROLES.ADMIN}>Admin</option>
                        </select>

                        {errorInvitar && <p style={{ color: '#B80531', fontSize: '0.85rem', margin: '8px 0' }}>{errorInvitar}</p>}
                        {successInvitar && <p style={{ color: 'var(--mid-green)', fontSize: '0.85rem', margin: '8px 0' }}>{successInvitar}</p>}

                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                            <button style={styles.btnPrimary} onClick={handleInvitar} disabled={invitando}>
                                {invitando ? 'Enviando...' : 'Invitar'}
                            </button>
                            <button style={styles.btnSecondary} onClick={() => { setModalInvitar(false); setErrorInvitar(''); setSuccessInvitar(''); }}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },
    modal: {
        background: 'var(--panel-background, #fff)',
        borderRadius: '30px',
        width: '350px',
        padding: '35px',
        maxWidth: '90vw',
        boxShadow: '0 8px 32px solid var(--mid-grey)',
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        background: 'var(--soft-grey)',
        height: '45px',
        width: '100%',
        padding: '8px 12px',
        borderRadius: '50px',
        border: 'var(--soft-grey)',
        marginBottom: '10px',
        fontSize: '0.9rem',
        boxSizing: 'border-box',
        background: 'var(--input-background, #f0f0f0)'
    },
    btnPrimary: {
        flex: 1,
        padding: '15px 18px',
        background: 'var(--light-green)',
        color: 'solid #0000',
        border: '1.1px solid var(--light-green)', // was 'none'
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 600,
        boxSizing: 'border-box' // <-- add this
    },
    btnSecondary: {
        flex: 1,
        padding: '15px 18px',
        background: 'transparent',
        border: '1.1px solid var(--mid-grey)',
        borderRadius: '30px', cursor: 'pointer',
        fontWeight: 600, // optional, for visual consistency
        boxSizing: 'border-box' // <-- add this
        // remove marginBottom: '6px' — that's pushing it down/changing its effective box, not relevant to width/height equality, but it's an odd leftover here
    },
    btnDanger: {
        padding: '6px 10px',
        background: '#B80531',
        color: '#fff',
        border: 'none',
        borderRadius: '100px',
        cursor: 'pointer',
        height: '45px',
        width: '45px'
    }
};

export default Menu;
