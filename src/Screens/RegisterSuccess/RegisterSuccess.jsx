import React from 'react'
import { useNavigate } from 'react-router-dom'

export const RegisterSuccess = () => {
    const navigate = useNavigate()

    return (
        <div className="login-container">
            <header className="logo-container_login">
                <img src="/whatsapp-login.png" alt="Logo de WhatsApp" />
            </header>
            <div className="login-form">
                <div className="login-form_login" style={{ textAlign: 'center', gap: '15px' }}>
                    <h2 style={{ margin: 0 }}>¡Registro exitoso!</h2>
                    <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                        Por favor, revisá tu correo electrónico para verificar tu cuenta
                        antes de iniciar sesión.
                    </p>
                    <button
                        type="button"
                        className="btn-submit"
                        onClick={() => navigate('/login')}
                    >
                        Ir a iniciar sesión
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterSuccess