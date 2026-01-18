DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS cars CASCADE;

CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL, 
  price_per_day DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  features TEXT[], 
  seats INTEGER DEFAULT 5,
  transmission VARCHAR(20) DEFAULT 'Automatyczna',
  fuel_type VARCHAR(20) DEFAULT 'Benzyna',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  user_name VARCHAR(200) NOT NULL,
  user_email VARCHAR(200) NOT NULL,
  user_phone VARCHAR(20),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', 
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_available ON cars(available);
CREATE INDEX idx_reservations_car_id ON reservations(car_id);
CREATE INDEX idx_reservations_dates ON reservations(start_date, end_date);
CREATE INDEX idx_reservations_status ON reservations(status);

COMMENT ON TABLE cars IS 'Stores information about available cars for rental';
COMMENT ON TABLE reservations IS 'Stores customer reservations';
