import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/home.css';
import Footer from '../Common/Footer';
import UserNav from '../Users/UserNavbar';

const MainLayout = () => {
        return (
        <>
            {/* Background decorations */}
            <div className="background-decoration">
                <div className="bg-shape-1"></div>
                <div className="bg-shape-2"></div>
                <div className="diagonal-line"></div>
            </div>

            <UserNav />

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
