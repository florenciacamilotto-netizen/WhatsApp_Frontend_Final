import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function Loading() {
    const navigate = useNavigate()
    const { login: syncroLogin } = useContext(AuthContext)
    const [progreso, setProgreso] = useState(0)

    useEffect(() => {
        const duracion = 3000
        const intervalo = 50
        const incremento = 100 / (duracion / intervalo)

        const timer = setInterval(() => {
            setProgreso(prev => {
                const siguiente = prev + incremento
                if (siguiente >= 100) {
                    clearInterval(timer)
                    return 100
                }
                return siguiente
            })
        }, intervalo)

        const redirect = setTimeout(() => {
            // CONFIRMAR TOKEN GUARDADO POR LOGIN //
            const pendingToken = sessionStorage.getItem('pending_token')
            if (pendingToken) {
                sessionStorage.removeItem('pending_token')
                syncroLogin(pendingToken)
            }
            navigate('/home')
        }, duracion)

        return () => {
            clearInterval(timer)
            clearTimeout(redirect)
        }
    }, [navigate])

    const handleLogout = () => {
        sessionStorage.removeItem('pending_token')
        navigate('/')
    }

    return (
        <div className="loading-container">
            <div className="loading-first_section">
                <div className="logo-wrapper">
                    <img src="/whatsapp-logo.jpg" alt="Logo de WhatsApp" />
                </div>
                <div className="loading-text">
                    <h3 className="loading-title">WhatsApp</h3>
                    <br />
                    <h3 className="loading-chats">Cargando mensajes...</h3>
                </div>
                <div className="loading-line">
                    <div
                        className="loading-progress-bar"
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
                <p className="loading-percentage">{Math.floor(progreso)}%</p>
                <p>Cifrado de extremo a extremo</p>
            </div>
            <div className="loading-second_section">
                <button className="btn-log_out" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}

export default Loading