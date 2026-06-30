import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AuthMiddleware() {
    const { isLogged } = useContext(AuthContext)

    if (isLogged) {
        // DIRIGIR A LA RUTA A LA CUAL EL USUARIO DESEABA ENTRAR //
        return <Outlet />
    }
    else {
        return <Navigate to={'/login'} />
    }
}

export default AuthMiddleware