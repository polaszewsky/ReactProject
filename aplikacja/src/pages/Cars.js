import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import './Cars.css';

function Cars() {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');

    // Date filters for availability
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchCars();
    }, [startDate, endDate, selectedCategory]);

    useEffect(() => {
        filterCars();
    }, [priceRange, cars]);

    const fetchCars = async () => {
        try {
            setLoading(true);
            let url = '/api/cars/available';
            const params = new URLSearchParams();

            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            if (selectedCategory !== 'all') params.append('category', selectedCategory);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            setCars(response.data.data);
            setFilteredCars(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setLoading(false);
        }
    };

    const filterCars = () => {
        let filtered = [...cars];

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(car => car.category === selectedCategory);
        }

        // Filter by price range
        if (priceRange !== 'all') {
            if (priceRange === 'low') {
                filtered = filtered.filter(car => car.price_per_day < 300);
            } else if (priceRange === 'medium') {
                filtered = filtered.filter(car => car.price_per_day >= 300 && car.price_per_day < 450);
            } else if (priceRange === 'high') {
                filtered = filtered.filter(car => car.price_per_day >= 450);
            }
        }

        setFilteredCars(filtered);
    };

    const categories = [
        { value: 'all', label: 'Wszystkie' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'suv', label: 'SUV' },
        { value: 'kombi', label: 'Kombi' },
        { value: 'van', label: 'Van' }
    ];

    const priceRanges = [
        { value: 'all', label: 'Wszystkie ceny' },
        { value: 'low', label: 'Do 300 zł' },
        { value: 'medium', label: '300-450 zł' },
        { value: 'high', label: 'Powyżej 450 zł' }
    ];

    return (
        <div className="cars-page">
            <div className="page-header">
                <div className="container">
                    <h1 className="page-title">Nasza Flota Pojazdów</h1>
                    <p className="page-subtitle">
                        Wybierz idealny samochód służbowy dla swojej firmy
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="filters-section">
                    <div className="filter-group">
                        <label className="filter-label">📅 Data wynajmu:</label>
                        <div className="date-filters">
                            <div className="date-input-group">
                                <label htmlFor="start-date">Od:</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="date-input-group">
                                <label htmlFor="end-date">Do:</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            {(startDate || endDate) && (
                                <button
                                    className="clear-dates-btn"
                                    onClick={() => {
                                        setStartDate('');
                                        setEndDate('');
                                    }}
                                >
                                    ❌ Wyczyść daty
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Kategoria:</label>
                        <div className="filter-buttons">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    className={`filter-btn ${selectedCategory === cat.value ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Cena za dzień:</label>
                        <div className="filter-buttons">
                            {priceRanges.map(range => (
                                <button
                                    key={range.value}
                                    className={`filter-btn ${priceRange === range.value ? 'active' : ''}`}
                                    onClick={() => setPriceRange(range.value)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="results-info">
                    <p>Znaleziono <strong>{filteredCars.length}</strong> pojazdów</p>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : filteredCars.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">🚗</div>
                        <h3>Brak wyników</h3>
                        <p>Nie znaleziono samochodów spełniających wybrane kryteria.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSelectedCategory('all');
                                setPriceRange('all');
                            }}
                        >
                            Wyczyść filtry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-3 cars-grid">
                        {filteredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cars;
