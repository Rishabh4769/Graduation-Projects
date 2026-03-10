import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../../styles/home.css';
import Footer from '../Common/Footer';
import UserNav from '../Users/UserNavbar';
import AdminNavbar from '../Admin/AdminNavbar';

const MainLayout = () => {
        const location = useLocation();
        const isAdminRoute = location.pathname.startsWith('/app/admin');

        return (
        <>
            {/* Background decorations */}
            <div className="background-decoration">
                <div className="bg-shape-1"></div>
                <div className="bg-shape-2"></div>
                <div className="diagonal-line"></div>
            </div>

            {isAdminRoute ? <AdminNavbar /> : <UserNav />}

            {/* Dynamic content via Outlet - FIXED WIDTH */}
            <div className="main">
                <div className="container">
                    <Outlet />
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default MainLayout;
