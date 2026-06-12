import "./Layout.css";

import { Outlet } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="application-section">
            <Header /> 

            <main className="josylinhas-main">
                <Outlet />
            </main>

            <Footer /> 
        </div>
    );
};

export default Layout;