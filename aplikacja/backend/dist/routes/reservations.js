"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
// GET all reservations
router.get('/', async (req, res) => {
    try {
        const { status, user_email } = req.query;
        let query = `
      SELECT r.*, c.brand, c.model, c.category, c.image_url
      FROM reservations r
      JOIN cars c ON r.car_id = c.id
      WHERE 1=1
    `;
        const params = [];
        if (status) {
            params.push(status);
            query += ` AND r.status = $${params.length}`;
        }
        if (user_email) {
            params.push(user_email);
            query += ` AND r.user_email = $${params.length}`;
        }
        query += ' ORDER BY r.created_at DESC';
        const result = await database_1.default.query(query, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET single reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query(`SELECT r.*, c.brand, c.model, c.category, c.image_url
       FROM reservations r
       JOIN cars c ON r.car_id = c.id
       WHERE r.id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST create new reservation
router.post('/', async (req, res) => {
    const client = await database_1.default.connect();
    try {
        await client.query('BEGIN');
        const { car_id, user_name, user_email, user_phone, start_date, end_date, total_price, notes } = req.body;
        // Check if car is available
        const carCheck = await client.query('SELECT available FROM cars WHERE id = $1', [car_id]);
        if (carCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Car not found' });
        }
        if (!carCheck.rows[0].available) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Car is not available' });
        }
        // Check for conflicting reservations
        const conflictCheck = await client.query(`SELECT id FROM reservations 
       WHERE car_id = $1 
       AND status != 'cancelled'
       AND (
         (start_date <= $2 AND end_date >= $2) OR
         (start_date <= $3 AND end_date >= $3) OR
         (start_date >= $2 AND end_date <= $3)
       )`, [car_id, start_date, end_date]);
        if (conflictCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Car is already reserved for these dates' });
        }
        // Create reservation
        const result = await client.query(`INSERT INTO reservations (car_id, user_name, user_email, user_phone, start_date, end_date, total_price, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed')
       RETURNING *`, [car_id, user_name, user_email, user_phone, start_date, end_date, total_price, notes]);
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
// PUT update reservation
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date, total_price, status, notes } = req.body;
        const result = await database_1.default.query(`UPDATE reservations 
       SET start_date = $1, end_date = $2, total_price = $3, status = $4, notes = $5
       WHERE id = $6
       RETURNING *`, [start_date, end_date, total_price, status, notes, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE (cancel) reservation
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await database_1.default.query(`UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.json({ message: 'Reservation cancelled successfully', reservation: result.rows[0] });
    }
    catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=reservations.js.map