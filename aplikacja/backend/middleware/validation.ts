// Validation middleware for car data
import { Request, Response, NextFunction } from 'express';

export const validateCarData = (req: Request, res: Response, next: NextFunction) => {
    const { brand, model, year, category, price_per_day } = req.body;
    const errors: string[] = [];

    // Required fields validation
    if (!brand || typeof brand !== 'string' || brand.trim().length < 2 || brand.trim().length > 100) {
        errors.push('Brand must be a string between 2 and 100 characters');
    }

    if (!model || typeof model !== 'string' || model.trim().length < 1 || model.trim().length > 100) {
        errors.push('Model must be a string between 1 and 100 characters');
    }

    if (!year || typeof year !== 'number' || year < 1900 || year > 2030) {
        errors.push('Year must be a number between 1900 and 2030');
    }

    const validCategories = ['sedan', 'suv', 'kombi', 'van'];
    if (!category || !validCategories.includes(category.toLowerCase())) {
        errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }

    if (!price_per_day || typeof price_per_day !== 'number' || price_per_day <= 0) {
        errors.push('Price per day must be a positive number');
    }

    // Optional fields validation
    if (req.body.image_url && typeof req.body.image_url !== 'string') {
        errors.push('Image URL must be a string');
    }

    if (req.body.seats && (typeof req.body.seats !== 'number' || req.body.seats < 1 || req.body.seats > 20)) {
        errors.push('Seats must be a number between 1 and 20');
    }

    if (req.body.features && !Array.isArray(req.body.features)) {
        errors.push('Features must be an array');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    // Sanitize data
    req.body.brand = brand.trim();
    req.body.model = model.trim();
    req.body.category = category.toLowerCase();

    next();
};

export const validateCarId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            error: 'Invalid car ID',
            details: ['ID must be a valid number']
        });
    }

    next();
};

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
    const { category, available } = req.query;
    const errors: string[] = [];

    if (category && typeof category === 'string') {
        const validCategories = ['sedan', 'suv', 'kombi', 'van'];
        if (!validCategories.includes(category.toLowerCase())) {
            errors.push(`Category must be one of: ${validCategories.join(', ')}`);
        }
    }

    if (available && available !== 'true' && available !== 'false') {
        errors.push('Available must be true or false');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Invalid query parameters',
            details: errors
        });
    }

    next();
};
