import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = () => {

    const currentLocation = useLocation();
    const { authenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                <p className="fs-5 font-semibold">
                    Carregando...
                </p>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: currentLocation }}
            />
        );
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/nao-encontrada"
                replace
            />
        );
    }

    return <Outlet />;
};

export default AdminRoute;