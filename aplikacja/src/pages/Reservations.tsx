import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Car } from '../types';
import '../styles/pages/Reservations.css';

function Reservations() {
    const [searchParams] = useSearchParams();
    const preselectedCarId = searchParams.get('car');

    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        car_id: preselectedCarId || '',
        user_name: '',
        user_email: '',
        user_phone: '',
        start_date: '',
        end_date: '',
        notes: ''
    });

    useEffect(() => {
        fetchCars();
    }, []);

    useEffect(() => {
        if (preselectedCarId) {
            setFormData(prev => ({ ...prev, car_id: preselectedCarId }));
        }
    }, [preselectedCarId]);

    const fetchCars = async () => {
        try {
            const response = await axios.get('/api/cars?available=true');
            // Backend returns { success: true, data: [...] }
            if (response.data && Array.isArray(response.data.data)) {
                setCars(response.data.data);
            } else if (Array.isArray(response.data)) {
                setCars(response.data);
            } else {
                console.error('Unexpected API response structure:', response.data);
                setCars([]);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            setCars([]);
        }
    };

    const calculateTotalPrice = () => {
        if (!formData.car_id || !formData.start_date || !formData.end_date) {
            return 0;
        }

        const car = cars.find(c => c.id === parseInt(formData.car_id));
        if (!car) return 0;

        const start = new Date(formData.start_date);
        const end = new Date(formData.end_date);
        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return days > 0 ? days * car.price_per_day : 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const totalPrice = calculateTotalPrice();

            await axios.post('/api/reservations', {
                ...formData,
                car_id: parseInt(formData.car_id),
                total_price: totalPrice
            });

            setSuccess(true);
            setFormData({
                car_id: '',
                user_name: '',
                user_email: '',
                user_phone: '',
                start_date: '',
                end_date: '',
                notes: ''
            });

            // Scroll to success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            console.error('Error creating reservation:', error);
            setError(error.response?.data?.error || 'Wystąpił błąd podczas tworzenia rezerwacji. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    const selectedCar = cars.find(c => c.id === parseInt(formData.car_id));
    const totalPrice = calculateTotalPrice();

    let days = 0;
    if (formData.start_date && formData.end_date) {
        const start = new Date(formData.start_date).getTime();
        const end = new Date(formData.end_date).getTime();
        days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="reservations-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Zarezerwuj Samochód</h1>
                    <p className="page-subtitle">
                        Wypełnij formularz i potwierdź swoją rezerwację
                    </p>
                </div>
            </div>

            <div className="container">
                {success && (
                    <div className="alert alert-success">
                        <div className="alert-icon">✅</div>
                        <div>
                            <h3>Rezerwacja potwierdzona!</h3>
                            <p>Dziękujemy za rezerwację. Potwierdzenie zostało wysłane na Twój adres email.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error">
                        <div className="alert-icon">❌</div>
                        <div>
                            <h3>Błąd</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <div className="reservation-container">
                    <form onSubmit={handleSubmit} className="reservation-form">
                        <div className="form-section">
                            <h2 className="form-section-title">Wybór Samochodu</h2>

                            <div className="form-group">
                                <label htmlFor="car_id">Samochód *</label>
                                <select
                                    id="car_id"
                                    name="car_id"
                                    value={formData.car_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Wybierz samochód...</option>
                                    {cars.map(car => (
                                        <option key={car.id} value={car.id.toString()}>
                                            {car.brand} {car.model} ({car.year}) - {car.price_per_day} zł/dzień
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2 className="form-section-title">Daty Wynajmu</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="start_date">Data rozpoczęcia *</label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        min={today}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="end_date">Data zakończenia *</label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        min={formData.start_date || today}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2 className="form-section-title">Dane Kontaktowe</h2>

                            <div className="form-group">
                                <label htmlFor="user_name">Imię i nazwisko *</label>
                                <input
                                    type="text"
                                    id="user_name"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    placeholder="Jan Kowalski"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="user_email">Email *</label>
                                    <input
                                        type="email"
                                        id="user_email"
                                        name="user_email"
                                        value={formData.user_email}
                                        onChange={handleChange}
                                        placeholder="jan.kowalski@firma.pl"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="user_phone">Telefon</label>
                                    <input
                                        type="tel"
                                        id="user_phone"
                                        name="user_phone"
                                        value={formData.user_phone}
                                        onChange={handleChange}
                                        placeholder="+48 123 456 789"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Dodatkowe uwagi</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Wpisz dodatkowe informacje lub specjalne wymagania..."
                                ></textarea>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                            {loading ? 'Przetwarzanie...' : 'Potwierdź Rezerwację'}
                        </button>
                    </form>

                    <div className="reservation-summary">
                        <h2 className="summary-title">Podsumowanie</h2>

                        {selectedCar ? (
                            <div className="summary-content">
                                <div className="summary-car">
                                    <img src={selectedCar.image_url} alt={`${selectedCar.brand} ${selectedCar.model}`} />
                                    <div className="summary-car-info">
                                        <h3>{selectedCar.brand} {selectedCar.model}</h3>
                                        <p className="summary-car-category">{selectedCar.category}</p>
                                    </div>
                                </div>

                                <div className="summary-details">
                                    {formData.start_date && formData.end_date && (
                                        <>
                                            <div className="summary-item">
                                                <span className="summary-label">Okres wynajmu:</span>
                                                <span className="summary-value">{days} {days === 1 ? 'dzień' : 'dni'}</span>
                                            </div>

                                            <div className="summary-item">
                                                <span className="summary-label">Cena za dzień:</span>
                                                <span className="summary-value">{selectedCar.price_per_day} zł</span>
                                            </div>

                                            <div className="summary-divider"></div>

                                            <div className="summary-item summary-total">
                                                <span className="summary-label">Łączna cena:</span>
                                                <span className="summary-value">{totalPrice.toFixed(2)} zł</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="summary-features">
                                    <h4>Wyposażenie:</h4>
                                    <ul>
                                        {selectedCar.features && selectedCar.features.map((feature, index) => (
                                            <li key={index}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="summary-placeholder">
                                <div className="placeholder-icon">🚗</div>
                                <p>Wybierz samochód, aby zobaczyć podsumowanie</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservations;
