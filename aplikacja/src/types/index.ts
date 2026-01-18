export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    category: string;
    price_per_day: number;
    image_url: string;
    available: boolean;
    features: string[];
    seats: number;
    transmission: string;
    fuel_type: string;
}

export interface Reservation {
    id: number;
    car_id: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    start_date: string;
    end_date: string;
    total_price: number;
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    brand?: string;
    model?: string;
    category?: string;
    image_url?: string;
}
