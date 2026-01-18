import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CarCard from '../components/CarCard';
import { Car } from '../types';
import '../styles/pages/Home.css';

function Home() {
    const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedCars();
    }, []);

    const fetchFeaturedCars = async () => {
        try {
            const response = await axios.get('/api/cars?available=true');
            setFeaturedCars((response.data.data || response.data).slice(0, 3));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setLoading(false);
        }
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container hero-content">
                    <h1 className="hero-title fade-in">
                        Wynajem Samochodów Służbowych<br />
                    </h1>
                    <p className="hero-subtitle fade-in">
                        Profesjonalna flota pojazdów dla Twojej firmy. Szeroki wybór, konkurencyjne ceny,
                        najwyższa jakość obsługi. Rezerwuj online w kilka minut.
                    </p>
                    <div className="hero-buttons fade-in">
                        <Link to="/cars" className="btn btn-primary btn-large">
                            Przeglądaj Samochody
                        </Link>
                        <Link to="/reservations" className="btn btn-secondary btn-large">
                            Zarezerwuj Teraz
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">20+</div>
                            <div className="stat-label">Pojazdów</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Zadowolonych Klientów</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Wsparcie</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title text-center">Jak to działa?</h2>
                    <p className="section-subtitle text-center">
                        Prosty proces rezerwacji w 3 krokach
                    </p>

                    <div className="steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon">🔍</div>
                            <h3 className="step-title">Wybierz Samochód</h3>
                            <p className="step-description">
                                Przeglądaj naszą szeroką gamę pojazdów służbowych i wybierz ten idealny dla Twoich potrzeb.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon">📅</div>
                            <h3 className="step-title">Zarezerwuj Online</h3>
                            <p className="step-description">
                                Wypełnij prosty formularz, wybierz daty i potwierdź rezerwację w kilka minut.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon">🚗</div>
                            <h3 className="step-title">Odbierz i Jedź</h3>
                            <p className="step-description">
                                Odbierz samochód w wybranym terminie i ciesz się komfortową jazdą.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="featured-cars">
                <div className="container">
                    <h2 className="section-title text-center">Popularne Samochody</h2>
                    <p className="section-subtitle text-center">
                        Najczęściej wybierane pojazdy przez naszych klientów
                    </p>

                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <div className="grid grid-3">
                            {featuredCars.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    )}

                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <Link to="/cars" className="btn btn-primary">
                            Zobacz Wszystkie Samochody
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <div className="container">
                    <h2 className="section-title text-center">Dlaczego My?</h2>

                    <div className="grid grid-4">
                        <div className="benefit-card">
                            <div className="benefit-icon">✅</div>
                            <h4>Najwyższa Jakość</h4>
                            <p>Wszystkie pojazdy regularnie serwisowane i w doskonałym stanie technicznym.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">💰</div>
                            <h4>Konkurencyjne Ceny</h4>
                            <p>Najlepsze stawki na rynku bez ukrytych kosztów.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">🛡️</div>
                            <h4>Pełne Ubezpieczenie</h4>
                            <p>Kompleksowa ochrona i bezpieczeństwo podczas wynajmu.</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">⚡</div>
                            <h4>Szybka Rezerwacja</h4>
                            <p>Online w kilka minut, bez zbędnych formalności.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
