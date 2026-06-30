import React, { useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import { register } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'

export const RegisterScreen = () => {
    const { login: syncroLogin } = useContext(AuthContext)
    const navigate = useNavigate()

    const {
        sendRequest: sendRequestRegister,
        loading: registerLoading,
        error: registerError,
        response: registerResponse
    } = useRequest()

    const initial_form_state = { username: '', email: '', password: '' }

    function onSubmit(formData) {
        sendRequestRegister(() => register(formData.email, formData.password, formData.username))
    }

    useEffect(() => {
        if (registerResponse?.ok) {
            syncroLogin(registerResponse?.data?.access_token)
            navigate('/home')
        }
    }, [registerResponse])

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div className="login-container">
            <header className="logo-container_login">
                <img src="/whatsapp-login.png" alt="Logo de WhatsApp" />
            </header>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="login-form_login">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={formState.username}
                            onChange={handleChange}
                        />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formState.email}
                            onChange={handleChange}
                        />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={formState.password}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={registerLoading || registerResponse?.ok}
                        >
                            {registerLoading ? 'Registrando...' : 'Registrarse'}
                        </button>

                        {registerError && !registerLoading && (
                            <span style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                                Error: {registerError}
                            </span>
                        )}

                        <p style={{ marginTop: '35px', fontSize: '14px' }}>
                            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterScreen
