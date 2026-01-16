import React from 'react';
import { Link } from 'react-router-dom';
import './CarCard.css';

function CarCard({ car }) {
    return (
        <div className="car-card fade-in">
            <div className="car-image-container">
                <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-image" />
                {car.available ? (
                    <span className="badge badge-success car-badge">Dostępny</span>
                ) : (
                    <span className="badge badge-danger car-badge">Niedostępny</span>
                )}
            </div>

            <div className="car-content">
                <div className="car-header">
                    <h3 className="car-title">{car.brand} {car.model}</h3>
                    <span className="car-year">{car.year}</span>
                </div>

                <div className="car-category">
                    <span className="category-badge">{car.category}</span>
                </div>

                <div className="car-features">
                    {car.features && car.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="feature-tag">
                            ✓ {feature}
                        </span>
                    ))}
                </div>

                <div className="car-specs">
                    <div className="spec">
                        <span className="spec-icon">👥</span>
                        <span>{car.seats || 5} miejsc</span>
                    </div>
                    <div className="spec">
                        <span className="spec-icon">⚙️</span>
                        <span>{car.transmission || 'Auto'}</span>
                    </div>
                    <div className="spec">
                        <span className="spec-icon">⛽</span>
                        <span>{car.fuel_type || 'Benzyna'}</span>
                    </div>
                </div>

                <div className="car-footer">
                    <div className="car-price">
                        <span className="price-amount">{car.price_per_day} zł</span>
                        <span className="price-period">/ dzień</span>
                    </div>

                    <Link
                        to={`/reservations?car=${car.id}`}
                        className={`btn ${car.available ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ pointerEvents: car.available ? 'auto' : 'none', opacity: car.available ? 1 : 0.6 }}
                    >
                        {car.available ? 'Zarezerwuj' : 'Niedostępny'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CarCard;
