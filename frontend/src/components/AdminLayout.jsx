import "./AdminLayout.css";

import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="admin-layout admin-background">
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;