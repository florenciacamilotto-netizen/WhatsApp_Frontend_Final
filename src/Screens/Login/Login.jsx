import React, { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import useForm from "../../hooks/useForm"
import { login } from "../../services/authService"
import useRequest from "../../hooks/useRequest"

export const Login = () => {

    const navigate = useNavigate()

    const {
        sendRequest: sendRequestLogin,
        loading: loginRequestLoading,
        error: loginRequestError,
        response: loginRequestResponse
    } = useRequest()

    const initial_form_state = {
        email: '',
        password: ''
    }

    function onSubmit(formData) {
        sendRequestLogin(
            () => login(formData.email, formData.password)
        )
    }

    useEffect(() => {
        if (loginRequestResponse?.ok) {
            // Guardamos el token en sessionStorage (temporal)
            // para que AlreadyAuthMiddleware NO lo detecte todavía
            sessionStorage.setItem('pending_token', loginRequestResponse?.data?.access_token)
            navigate("/loading")
        }
    }, [loginRequestResponse])

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div className="login-container">
            <header className="logo-container_login">
                <img src="/whatsapp-login.png" alt="Logo de WhatsApp" />
            </header>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="login-form_login">
                        <input id="email" name="email" type="email" placeholder="Email" value={formState.email} onChange={handleChange} />
                        <input id="password" name="password" type="password" placeholder="Contraseña" value={formState.password} onChange={handleChange} />

                        <button
                            type="submit" className="btn-submit"
                            disabled={loginRequestLoading || loginRequestResponse?.ok}>
                            {loginRequestLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </button>

                        {loginRequestError && !loginRequestLoading && (
                            <span style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                                Error: {loginRequestError}
                            </span>
                        )}

                        <p style={{ marginTop: '35px', fontSize: '14px' }}>
                            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
