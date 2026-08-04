import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthRoute = () => {

    const currentLocation = useLocation();
    const { authenticated, loading } = useAuth();

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

    return <Outlet />;
};

export default AuthRoute;