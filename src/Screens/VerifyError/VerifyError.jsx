import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const VerifyError = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const message = searchParams.get('message') || 'No se pudo verificar tu cuenta.'

    return (
        <div className="login-container">
            <header className="logo-container_login">
                <img src="/whatsapp-login.png" alt="Logo de WhatsApp" />
            </header>
            <div className="login-form">
                <div className="login-form_login" style={{ textAlign: 'center', gap: '15px' }}>
                    <h2 style={{ margin: 0 }}>Error al verificar la cuenta</h2>
                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        {message}
                    </p>
                    <button
                        type="button"
                        className="btn-submit"
                        onClick={() => navigate('/login')}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerifyError