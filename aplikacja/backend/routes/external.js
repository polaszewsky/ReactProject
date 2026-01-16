const express = require('express');
const router = express.Router();
const axios = require('axios');

// ExchangeRate API - konwersja walut
router.get('/exchange-rates', async (req, res) => {
    try {
        const baseCurrency = req.query.base || 'PLN';

        // Wywołanie zewnętrznego API
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
            timeout: 5000 // 5 sekund timeout
        });

        if (!response.data || !response.data.rates) {
            throw new Error('Invalid response from exchange rate API');
        }

        // Zwracamy najważniejsze waluty
        const rates = {
            base: baseCurrency,
            date: response.data.date,
            rates: {
                PLN: response.data.rates.PLN || 1,
                EUR: response.data.rates.EUR,
                USD: response.data.rates.USD,
                GBP: response.data.rates.GBP
            }
        };

        res.json(rates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message);

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({
                error: 'Gateway Timeout',
                message: 'External API request timed out'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json({
                error: 'External API Error',
                message: error.response.data?.message || 'Failed to fetch exchange rates'
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch exchange rates from external API'
        });
    }
});

// Konwersja konkretnej kwoty
router.post('/convert', async (req, res) => {
    try {
        const { amount, from, to } = req.body;

        // Walidacja danych wejściowych
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                error: 'Validation Error',
                details: ['Amount must be a positive number']
            });
        }

        if (!from || !to) {
            return res.status(400).json({
                error: 'Validation Error',
                details: ['From and To currencies are required']
            });
        }

        // Pobierz kursy walut
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`, {
            timeout: 5000
        });

        if (!response.data || !response.data.rates || !response.data.rates[to]) {
            return res.status(400).json({
                error: 'Invalid Currency',
                message: `Currency ${to} not found`
            });
        }

        const rate = response.data.rates[to];
        const convertedAmount = amount * rate;

        res.json({
            original: {
                amount: amount,
                currency: from
            },
            converted: {
                amount: parseFloat(convertedAmount.toFixed(2)),
                currency: to
            },
            rate: rate,
            date: response.data.date
        });

    } catch (error) {
        console.error('Error converting currency:', error.message);

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to convert currency'
        });
    }
});

module.exports = router;
