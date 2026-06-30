import React, { useEffect } from 'react'
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'

export const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const reset_password_token = searchParams.get('reset_password_token')

    const {
        sendRequest,
        loading,
        error,
        response
    } = useRequest()

    const initial_form_state = { password: '', confirm_password: '' }

    function onSubmit(formData) {
        if (formData.password !== formData.confirm_password) {
            alert('Las contraseñas no coinciden')
            return
        }
        // sendRequest(() => resetPassword(reset_password_token, formData.password))
    }

    useEffect(() => {
        if (response?.ok) navigate('/login')
    }, [response])

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    if (!reset_password_token) return <Navigate to="/login" />

    return (
        <div className="login-container">
            <header className="logo-container_login">
                <img src="/whatsapp-login.png" alt="Logo de WhatsApp" />
            </header>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="login-form_login">
                        <h3 style={{ marginBottom: '10px', color: '#333' }}>Restablecer contraseña</h3>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Nueva contraseña"
                            value={formState.password}
                            onChange={handleChange}
                        />
                        <input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={formState.confirm_password}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || response?.ok}
                        >
                            {loading ? 'Guardando...' : 'Restablecer'}
                        </button>

                        {error && !loading && (
                            <span style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                                Error: {error}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordScreen
