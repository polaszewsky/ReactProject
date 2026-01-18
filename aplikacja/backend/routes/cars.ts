import express, { Request, Response } from 'express';
import pool from '../config/database';
import { validateCarData, validateCarId, validateQueryParams } from '../middleware/validation';

const router = express.Router();

// GET available cars based on date range
router.get('/available', async (req: Request, res: Response) => {
    try {
        const { start_date, end_date, category } = req.query;

        // Base query to get all cars
        let query = `
            SELECT DISTINCT c.* 
            FROM cars c
            WHERE c.available = true
        `;
        const params: any[] = [];

        // Add category filter if provided
        if (category && category !== 'all') {
            params.push((category as string).toLowerCase());
            query += ` AND c.category = $${params.length}`;
        }

        // If dates are provided, exclude cars with conflicting reservations
        if (start_date && end_date) {
            query += `
                AND c.id NOT IN (
                    SELECT DISTINCT car_id
                    FROM reservations
                    WHERE status NOT IN ('cancelled', 'completed')
                    AND (
                        (start_date <= $${params.length + 1} AND end_date >= $${params.length + 1}) OR
                        (start_date <= $${params.length + 2} AND end_date >= $${params.length + 2}) OR
                        (start_date >= $${params.length + 1} AND end_date <= $${params.length + 2})
                    )
                )
            `;
            params.push(start_date, end_date);
        }

        query += ' ORDER BY c.id ASC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
            filters: {
                start_date: start_date || null,
                end_date: end_date || null,
                category: category || 'all'
            }
        });
    } catch (error) {
        console.error('Error fetching available cars:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch available cars from database'
        });
    }
});

// GET all cars - z walidacją parametrów
router.get('/', validateQueryParams, async (req: Request, res: Response) => {
    try {
        const { category, available } = req.query;

        let query = 'SELECT * FROM cars WHERE 1=1';
        const params: any[] = [];

        if (category) {
            params.push((category as string).toLowerCase());
            query += ` AND category = $${params.length}`;
        }

        if (available !== undefined) {
            params.push(available === 'true');
            query += ` AND available = $${params.length}`;
        }

        query += ' ORDER BY id ASC';

        const result = await pool.query(query, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch cars from database'
        });
    }
});

// GET single car by ID - z walidacją ID
router.get('/:id', validateCarId, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Car with ID ${id} not found`
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch car from database'
        });
    }
});

// POST create new car - z pełną walidacją
router.post('/', validateCarData, async (req: Request, res: Response) => {
    try {
        const { brand, model, year, category, price_per_day, image_url, features, seats, transmission, fuel_type } = req.body;

        const result = await pool.query(
            `INSERT INTO cars (brand, model, year, category, price_per_day, image_url, features, seats, transmission, fuel_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [brand, model, year, category, price_per_day, image_url || null, features || [], seats || 5, transmission || 'Automatyczna', fuel_type || 'Benzyna']
        );

        res.status(201).json({
            success: true,
            message: 'Car created successfully',
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error creating car:', error);

        if (error.code === '23505') { // Unique violation
            return res.status(409).json({
                error: 'Conflict',
                message: 'Car with these details already exists'
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create car in database'
        });
    }
});

// PUT update car - z walidacją
router.put('/:id', validateCarId, validateCarData, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { brand, model, year, category, price_per_day, image_url, available, features, seats, transmission, fuel_type } = req.body;

        // Sprawdź czy samochód istnieje
        const checkResult = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Car with ID ${id} not found`
            });
        }

        const result = await pool.query(
            `UPDATE cars 
       SET brand = $1, model = $2, year = $3, category = $4, price_per_day = $5, 
           image_url = $6, available = $7, features = $8, seats = $9, transmission = $10, fuel_type = $11
       WHERE id = $12
       RETURNING *`,
            [brand, model, year, category, price_per_day, image_url, available !== undefined ? available : true, features || [], seats || 5, transmission || 'Automatyczna', fuel_type || 'Benzyna', id]
        );

        res.json({
            success: true,
            message: 'Car updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update car in database'
        });
    }
});

// DELETE car - z sprawdzeniem rezerwacji
router.delete('/:id', validateCarId, async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;

        // Sprawdź czy samochód istnieje
        const carResult = await client.query('SELECT * FROM cars WHERE id = $1', [id]);
        if (carResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                error: 'Not Found',
                message: `Car with ID ${id} not found`
            });
        }

        // Sprawdź czy są aktywne rezerwacje
        const reservationsResult = await client.query(
            `SELECT COUNT(*) as count FROM reservations 
       WHERE car_id = $1 AND status != 'cancelled' AND status != 'completed'`,
            [id]
        );

        if (parseInt(reservationsResult.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                error: 'Conflict',
                message: 'Cannot delete car with active reservations. Please cancel or complete all reservations first.',
                activeReservations: parseInt(reservationsResult.rows[0].count)
            });
        }

        // Usuń samochód
        const deleteResult = await client.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Car deleted successfully',
            data: deleteResult.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting car:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete car from database'
        });
    } finally {
        client.release();
    }
});

export default router;
