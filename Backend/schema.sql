DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS part;
DROP TABLE IF EXISTS service;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE vehicle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    fuel_type TEXT NOT NULL,
    owner_id INTEGER NOT NULL
);

CREATE TABLE part (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL
);

CREATE TABLE service (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    odometer INTEGER NOT NULL,
    time TEXT DEFAULT "2026-01-01",
    labor_cost INTEGER NOT NULL DEFAULT 0,
    owner_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL
);

CREATE TABLE service_part (
    service_id INTEGER NOT NULL,
    part_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (service_id, part_id),
    FOREIGN KEY (service_id) REFERENCES service (id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES part (id) ON DELETE CASCADE
)