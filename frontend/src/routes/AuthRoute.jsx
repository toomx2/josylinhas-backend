import axios from "axios";

import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {

    const currentLocation = useLocation();

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(
                    "http://localhost:5000/me",
                    { withCredentials: true }
                );
                setAuthenticated(true);
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

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