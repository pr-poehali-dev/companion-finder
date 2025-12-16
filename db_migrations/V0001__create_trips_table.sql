CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    train_number VARCHAR(50) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    car_number VARCHAR(10) NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trips_search ON trips(train_number, departure_date, arrival_date, departure_time, arrival_time, car_number);