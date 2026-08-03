import api from "../services/api";

import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {

    const currentLocation = useLocation();

    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const res = await api.get("/me");
                setAuthUser(res.data.user);
            } catch (error) {
                setAuthUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkPermission();
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

    if (!authUser) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: currentLocation }}
            />
        );
    }

    const isAdminUser = ["SuperAdmin", "Admin"].includes(authUser?.role);

    if (!isAdminUser) {
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