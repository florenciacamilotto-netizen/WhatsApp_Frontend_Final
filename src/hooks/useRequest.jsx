import { useState } from "react"

// GESTIONAR CONSULTAS AL SERVIDOR //
function useRequest() {

    // ESTADO PENDIENTE //
    const [loading, setLoading] = useState(false)
    // ESTADO RESUELTO //
    const [response, setResponse] = useState(null)
    // ESTADO RECHAZADO //
    const [error, setError] = useState(null)

    // LLAMAR AL SERVIDOR A TRAVÉS DEL PARÁMETRO DE LA FUNCIÓN REQUESTCALLBACKFN //
    async function sendRequest(requestCallbackFn) {
        try {
            setLoading(true)
            // ELIMINAR ERRORES PREVIOS //
            setError(null)
            const server_response = await requestCallbackFn()
            setResponse(server_response)
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }
    return {
        sendRequest,
        loading,
        response,
        error
    }
}

export default useRequest