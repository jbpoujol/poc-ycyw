
-- ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    permissions TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birthday DATE,
    address_line TEXT,
    language VARCHAR(10),
    phone_number VARCHAR(20),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    country VARCHAR(2),
    role_id INTEGER REFERENCES roles(id)
);

-- CATEGORIES_TICKET
CREATE TABLE categories_ticket (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- TICKETS
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_category_id INTEGER REFERENCES categories_ticket(id),
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    resolution_date TIMESTAMP,
    is_closed BOOLEAN DEFAULT FALSE
);

-- CHAT_SESSIONS
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id),
    invite_id INTEGER REFERENCES users(id),
    subject VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('open', 'closed'))
);

-- CHAT_MESSAGE
CREATE TABLE chat_message (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(10) CHECK (type IN ('text', 'image', 'file')),
    attachment_url TEXT
);

-- VISIO_SESSIONS
CREATE TABLE visio_sessions (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id),
    invite_id INTEGER REFERENCES users(id),
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    status VARCHAR(50)
);

-- AGENCIES
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone_number VARCHAR(20),
    email VARCHAR(255)
);

-- CATEGORIES_VEHICULES
CREATE TABLE categories_vehicules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

-- VEHICULES
CREATE TABLE vehicules (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories_vehicules(id),
    available BOOLEAN DEFAULT TRUE,
    name VARCHAR(100),
    plate_number VARCHAR(20),
    seats INTEGER,
    horse_power INTEGER,
    image_url TEXT,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    year INTEGER,
    mileage INTEGER
);

-- OFFERS
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    vehicule_id INTEGER REFERENCES vehicules(id),
    agency_departure_id INTEGER REFERENCES agencies(id),
    agency_arrival_id INTEGER REFERENCES agencies(id),
    departure_date TIMESTAMP,
    return_date TIMESTAMP,
    price DECIMAL(10, 2),
    currency VARCHAR(10),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RESERVATIONS
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    offer_id INTEGER REFERENCES offers(id),
    reservation_date TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservations(id),
    user_id INTEGER REFERENCES users(id),
    date TIMESTAMP,
    amount DECIMAL(10, 2),
    currency VARCHAR(10),
    payment_method VARCHAR(50),
    status VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_reference VARCHAR(255),
    refund_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_pdf_link TEXT
);
