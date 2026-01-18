import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import '../styles/components/Navbar.css';

function Navbar() {
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <nav className="navbar">
                <div className="container navbar-content">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">🚗</span>
                        <span className="logo-text">CarRental<span className="text-gradient">Pro</span></span>
                    </Link>

                    <ul className="navbar-menu">
                        <li>
                            <Link to="/" className={`nav-link ${isActive('/')}`}>
                                Strona Główna
                            </Link>
                        </li>
                        <li>
                            <Link to="/cars" className={`nav-link ${isActive('/cars')}`}>
                                Samochody
                            </Link>
                        </li>
                        <li>
                            <Link to="/reservations" className={`nav-link ${isActive('/reservations')}`}>
                                Rezerwacje
                            </Link>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                                    Panel Admin
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-auth">
                        {user ? (
                            <div className="auth-user">
                                <span className="user-name">👤 {user.username}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-logout">
                                    Wyloguj
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary navbar-cta">
                                Zaloguj się
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
}

export default Navbar;
