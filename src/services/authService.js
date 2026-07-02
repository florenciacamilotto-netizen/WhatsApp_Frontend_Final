import ENVIRONMENT from "../config/environment"

// LOGIN //
export async function login(email, password) {
    const response_http = await fetch(
        ENVIRONMENT.URL_API + "/api/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                email: email,
                password: password
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response
}

// REGISTER //
export async function register(username, email, password) {
 
    const response_http = await fetch(
        ENVIRONMENT.URL_API + "/api/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                name: username,
                email: email,
                password: password
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response
}