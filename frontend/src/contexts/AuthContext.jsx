import api from "../services/api";

import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext(null);

const adminRoles = ["SuperAdmin", "Admin"];

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refreshAuth() {
        try {
            const res = await api.get("/me");

            setUser(res.data.user);

            return res.data.user;
        } catch (error) {
            setUser(null);

            return null;
        } finally {
            setLoading(false);
        }
    }

    async function login(credentials) {
        await api.post("/login", credentials);

        const authUser = await refreshAuth();

        return authUser;
    }

    async function logout() {
        await api.post("/logout");
        setUser(null);
    }

    useEffect(() => {
        refreshAuth();
    }, []);

    const authenticated = Boolean(user);
    const isAdmin = adminRoles.includes(user?.role);
    const isSuperAdmin = user?.role === "SuperAdmin";

    return (
        <AuthContext.Provider value={{
            user,
            authenticated,
            isAdmin,
            isSuperAdmin,
            loading,
            login,
            logout,
            refreshAuth
        }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("O hook useAuth deve ser utilizado dentro de um AuthProvider.");
    }

    return context;

};