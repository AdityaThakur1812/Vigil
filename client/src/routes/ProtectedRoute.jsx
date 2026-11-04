import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute(){
    const { isAuthenticated , loading } = useAuth();

    if(loading){
        return(
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Cheking Authentication.....
            </div>
        );
    }

    return isAuthenticated ? (
        <Outlet/>
    ) : (
        <Navigate to = "/login" replace /> 
    );
}

export default ProtectedRoute;