import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4 className="footer-title">
                            <span className="logo-icon">🚗</span>
                            CarRental<span className="text-gradient">Pro</span>
                        </h4>
                        <p className="footer-description">
                            Profesjonalny wynajem samochodów służbowych dla Twojej firmy.
                            Szeroki wybór pojazdów, konkurencyjne ceny, najwyższa jakość obsługi.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h5 className="footer-heading">Kontakt</h5>
                        <ul className="footer-links">
                            <li>📧 kontakt@carrental.pl</li>
                            <li>📱 +48 123 456 789</li>
                            <li>📍 ul. Przykładowa 123, Warszawa</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h5 className="footer-heading">Godziny Otwarcia</h5>
                        <ul className="footer-links">
                            <li>Pon - Pt: 8:00 - 18:00</li>
                            <li>Sobota: 9:00 - 14:00</li>
                            <li>Niedziela: Zamknięte</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h5 className="footer-heading">Social Media</h5>
                        <div className="social-links">
                            <a href="#" className="social-link">Facebook</a>
                            <a href="#" className="social-link">LinkedIn</a>
                            <a href="#" className="social-link">Instagram</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 CarRentalPro. Wszystkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
