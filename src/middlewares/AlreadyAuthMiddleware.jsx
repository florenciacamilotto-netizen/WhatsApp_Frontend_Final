import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AlreadyAuthMiddleware() {
    const { isLogged } = useContext(AuthContext)
    const location = useLocation()

    // LOADING CONECTA LOGIN CON HOME //
    if (location.pathname === '/loading') return <Outlet />

    if (!isLogged) {
        return <Outlet />
    } else {
        return <Navigate to='/home' />
    }
}

export default AlreadyAuthMiddleware
