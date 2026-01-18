import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Car, Reservation } from '../types';
import '../styles/pages/Admin.css';

interface ExchangeRates {
    rates: {
        [key: string]: number;
    };
    date: string;
}

function Admin() {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loadingReservations, setLoadingReservations] = useState(false);
    // States for custom confirmation to avoid window.confirm issues
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear().toString(),
        category: 'sedan',
        price_per_day: '',
        image_url: '',
        features: '',
        seats: '5',
        transmission: 'Automatyczna',
        fuel_type: 'Benzyna',
        available: true
    });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchCars();
        fetchExchangeRates();
    }, [isAdmin, navigate]);

    const fetchCars = async () => {
        try {
            const response = await axios.get('/api/cars');
            setCars(response.data.data || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setLoading(false);
        }
    };

    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get('/api/external/exchange-rates?base=PLN');
            setExchangeRates(response.data);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const fetchReservations = async () => {
        try {
            setLoadingReservations(true);
            const response = await axios.get('/api/reservations');
            setReservations(response.data);
            setLoadingReservations(false);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setLoadingReservations(false);
        }
    };

    const handleCancelReservation = async (id: number) => {
        if (cancelConfirmId === id) {
            // Confirmed
            try {
                await axios.delete(`/api/reservations/${id}`);
                setCancelConfirmId(null);
                fetchReservations();
            } catch (error: any) {
                console.error('Error cancelling reservation:', error);
                alert(`Błąd: ${error.message}`);
            }
        } else {
            // First click - wait for confirmation
            setCancelConfirmId(id);
            setTimeout(() => setCancelConfirmId(null), 3000); // Reset after 3s
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const carData = {
                ...formData,
                year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
                price_per_day: typeof formData.price_per_day === 'string' ? parseFloat(formData.price_per_day) : formData.price_per_day,
                seats: typeof formData.seats === 'string' ? parseInt(formData.seats) : formData.seats,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f)
            };

            if (editingCar) {
                // Update
                await axios.put(`/api/cars/${editingCar.id}`, carData);
                alert('Samochód zaktualizowany pomyślnie!');
            } else {
                // Create
                await axios.post('/api/cars', carData);
                alert('Samochód dodany pomyślnie!');
            }

            // Reset form
            setFormData({
                brand: '',
                model: '',
                year: new Date().getFullYear().toString(),
                category: 'sedan',
                price_per_day: '',
                image_url: '',
                features: '',
                seats: '5',
                transmission: 'Automatyczna',
                fuel_type: 'Benzyna',
                available: true
            });
            setEditingCar(null);
            setActiveTab('list');
            fetchCars();
        } catch (error: any) {
            console.error('Error saving car:', error);
            alert(error.response?.data?.message || 'Błąd podczas zapisywania samochodu');
        }
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
        setFormData({
            brand: car.brand,
            model: car.model,
            year: car.year.toString(),
            category: car.category,
            price_per_day: car.price_per_day.toString(),
            image_url: car.image_url || '',
            features: car.features ? car.features.join(', ') : '',
            seats: car.seats.toString(),
            transmission: car.transmission,
            fuel_type: car.fuel_type,
            available: car.available
        });
        setActiveTab('add');
    };

    const handleDelete = async (id: number) => {
        if (deleteConfirmId === id) {
            // Confirmed
            try {
                await axios.delete(`/api/cars/${id}`);
                setDeleteConfirmId(null);
                fetchCars();
            } catch (error: any) {
                console.error('Error deleting car:', error);
                alert(error.response?.data?.message || 'Błąd podczas usuwania samochodu');
            }
        } else {
            // First click - wait for confirmation
            setDeleteConfirmId(id);
            setTimeout(() => setDeleteConfirmId(null), 3000); // Reset after 3s
        }
    };

    const convertPrice = (pricePLN: number, currency: string) => {
        if (!exchangeRates || !exchangeRates.rates[currency]) return '-';
        const rate = exchangeRates.rates[currency];
        return (pricePLN * rate).toFixed(2);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="container">
                    <h1>Panel Administracyjny</h1>
                    <p>Zarządzanie flotą pojazdów</p>
                </div>
            </div>

            <div className="container">
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('list');
                            setEditingCar(null);
                        }}
                    >
                        📋 Lista Samochodów ({cars.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        ➕ {editingCar ? 'Edytuj Samochód' : 'Dodaj Samochód'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab('reservations');
                            fetchReservations();
                        }}
                    >
                        📅 Rezerwacje ({reservations.length})
                    </button>
                </div>

                {activeTab === 'list' ? (
                    <div className="admin-content">
                        {exchangeRates && (
                            <div className="exchange-rates-info">
                                <h3>📊 Kursy Walut (PLN)</h3>
                                <div className="rates-grid">
                                    <div className="rate-item">
                                        <span>EUR:</span>
                                        <strong>{exchangeRates.rates.EUR.toFixed(4)}</strong>
                                    </div>
                                    <div className="rate-item">
                                        <span>USD:</span>
                                        <strong>{exchangeRates.rates.USD.toFixed(4)}</strong>
                                    </div>
                                    <div className="rate-item">
                                        <span>GBP:</span>
                                        <strong>{exchangeRates.rates.GBP.toFixed(4)}</strong>
                                    </div>
                                    <div className="rate-date">
                                        Aktualizacja: {exchangeRates.date}
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <div className="cars-table-container">
                                <table className="cars-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Zdjęcie</th>
                                            <th>Marka & Model</th>
                                            <th>Rok</th>
                                            <th>Kategoria</th>
                                            <th>Cena (PLN)</th>
                                            {exchangeRates && (
                                                <>
                                                    <th>EUR</th>
                                                    <th>USD</th>
                                                </>
                                            )}
                                            <th>Status</th>
                                            <th>Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cars.map(car => (
                                            <tr key={car.id}>
                                                <td>{car.id}</td>
                                                <td>
                                                    {car.image_url && (
                                                        <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="table-car-image" />
                                                    )}
                                                </td>
                                                <td>
                                                    <strong>{car.brand} {car.model}</strong>
                                                </td>
                                                <td>{car.year}</td>
                                                <td>
                                                    <span className="category-tag">{car.category}</span>
                                                </td>
                                                <td>{car.price_per_day} zł</td>
                                                {exchangeRates && (
                                                    <>
                                                        <td>{convertPrice(car.price_per_day, 'EUR')} €</td>
                                                        <td>{convertPrice(car.price_per_day, 'USD')} $</td>
                                                    </>
                                                )}
                                                <td>
                                                    <span className={`status-badge ${car.available ? 'available' : 'unavailable'}`}>
                                                        {car.available ? 'Dostępny' : 'Niedostępny'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEdit(car);
                                                            }}
                                                            className="btn-edit"
                                                        >
                                                            ✏️ Edytuj
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDelete(car.id);
                                                            }}
                                                            className={deleteConfirmId === car.id ? "btn-confirm-delete" : "btn-delete"}
                                                        >
                                                            {deleteConfirmId === car.id ? "⚠️ Potwierdź" : "🗑️ Usuń"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'reservations' ? (
                    <div className="admin-content">
                        <h2>📅 Zarządzanie Rezerwacjami</h2>
                        <p className="section-description">
                            Przeglądaj wszystkie rezerwacje i zarządzaj nimi
                        </p>

                        {loadingReservations ? (
                            <div className="spinner"></div>
                        ) : reservations.length === 0 ? (
                            <div className="no-results">
                                <div className="no-results-icon">📅</div>
                                <h3>Brak rezerwacji</h3>
                                <p>Nie ma jeszcze żadnych rezerwacji w systemie.</p>
                            </div>
                        ) : (
                            <div className="cars-table-container">
                                <table className="cars-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Samochód</th>
                                            <th>Klient</th>
                                            <th>Email</th>
                                            <th>Telefon</th>
                                            <th>Data od</th>
                                            <th>Data do</th>
                                            <th>Uwagi</th>
                                            <th>Cena</th>
                                            <th>Status</th>
                                            <th>Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map(reservation => (
                                            <tr key={reservation.id}>
                                                <td>{reservation.id}</td>
                                                <td>
                                                    <div className="car-info-cell">
                                                        {reservation.image_url && (
                                                            <img
                                                                src={reservation.image_url}
                                                                alt={`${reservation.brand} ${reservation.model}`}
                                                                className="table-car-image"
                                                            />
                                                        )}
                                                        <strong>{reservation.brand} {reservation.model}</strong>
                                                    </div>
                                                </td>
                                                <td>{reservation.user_name}</td>
                                                <td>{reservation.user_email}</td>
                                                <td>{reservation.user_phone || '-'}</td>
                                                <td>{new Date(reservation.start_date).toLocaleDateString('pl-PL')}</td>
                                                <td>{new Date(reservation.end_date).toLocaleDateString('pl-PL')}</td>
                                                <td>{reservation.notes || '-'}</td>
                                                <td><strong>{reservation.total_price} zł</strong></td>
                                                <td>
                                                    <span className={`status-badge status-${reservation.status}`}>
                                                        {reservation.status === 'confirmed' && '✅ Potwierdzona'}
                                                        {reservation.status === 'pending' && '⏳ Oczekująca'}
                                                        {reservation.status === 'completed' && '✔️ Zakończona'}
                                                        {reservation.status === 'cancelled' && '❌ Anulowana'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleCancelReservation(reservation.id);
                                                            }}
                                                            className={cancelConfirmId === reservation.id ? "btn-confirm-delete" : "btn-delete"}
                                                        >
                                                            {cancelConfirmId === reservation.id ? "⚠️ Potwierdź" : "🚫 Anuluj"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="admin-content">
                        <div className="admin-form-container">
                            <h2>{editingCar ? 'Edytuj Samochód' : 'Dodaj Nowy Samochód'}</h2>

                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="brand">Marka *</label>
                                        <input
                                            type="text"
                                            id="brand"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            required
                                            placeholder="np. Toyota"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="model">Model *</label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            required
                                            placeholder="np. Camry"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="year">Rok *</label>
                                        <input
                                            type="number"
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                            min={1900}
                                            max={2030}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Kategoria *</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="sedan">Sedan</option>
                                            <option value="suv">SUV</option>
                                            <option value="kombi">Kombi</option>
                                            <option value="van">Van</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="price_per_day">Cena za dzień (PLN) *</label>
                                        <input
                                            type="number"
                                            id="price_per_day"
                                            name="price_per_day"
                                            value={formData.price_per_day}
                                            onChange={handleChange}
                                            required
                                            min={0}
                                            step={0.01}
                                            placeholder="250.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="seats">Liczba miejsc *</label>
                                        <input
                                            type="number"
                                            id="seats"
                                            name="seats"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            required
                                            min={1}
                                            max={20}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="transmission">Skrzynia biegów</label>
                                        <select
                                            id="transmission"
                                            name="transmission"
                                            value={formData.transmission}
                                            onChange={handleChange}
                                        >
                                            <option value="Automatyczna">Automatyczna</option>
                                            <option value="Manualna">Manualna</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="fuel_type">Typ paliwa</label>
                                        <select
                                            id="fuel_type"
                                            name="fuel_type"
                                            value={formData.fuel_type}
                                            onChange={handleChange}
                                        >
                                            <option value="Benzyna">Benzyna</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Hybryda">Hybryda</option>
                                            <option value="Elektryczny">Elektryczny</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="image_url">URL Zdjęcia</label>
                                    <input
                                        type="url"
                                        id="image_url"
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {formData.image_url && (
                                        <div className="image-preview">
                                            <img src={formData.image_url} alt="Preview" />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="features">Wyposażenie (oddzielone przecinkami)</label>
                                    <textarea
                                        id="features"
                                        name="features"
                                        value={formData.features}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="GPS, Klimatyzacja, Bluetooth, Kamera cofania"
                                    ></textarea>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={formData.available}
                                            onChange={handleChange}
                                        />
                                        <span>Dostępny do wynajmu</span>
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        {editingCar ? '💾 Zapisz Zmiany' : '➕ Dodaj Samochód'}
                                    </button>
                                    {editingCar && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setEditingCar(null);
                                                setFormData({
                                                    brand: '',
                                                    model: '',
                                                    year: new Date().getFullYear().toString(),
                                                    category: 'sedan',
                                                    price_per_day: '',
                                                    image_url: '',
                                                    features: '',
                                                    seats: '5',
                                                    transmission: 'Automatyczna',
                                                    fuel_type: 'Benzyna',
                                                    available: true
                                                });
                                            }}
                                        >
                                            ❌ Anuluj
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
