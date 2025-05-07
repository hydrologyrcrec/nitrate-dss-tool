-- CREATE NECESSARY TABLES AND EXTENSIONS

-- 1. Stations Schema
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE stations (
    station_id INTEGER PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    station_location GEOGRAPHY(Point, 4326) NOT NULL
);

-- 2. Data Links Schema
CREATE SEQUENCE data_links_link_id_seq;

CREATE TABLE data_links (
    link_id INTEGER PRIMARY KEY DEFAULT nextval('data_links_link_id_seq'),
    station_id INTEGER NOT NULL,
    link_label VARCHAR(255) NOT NULL,
    link_url TEXT NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    CONSTRAINT data_links_station_id_fkey FOREIGN KEY (station_id)
        REFERENCES stations(station_id) ON DELETE CASCADE
);

-- INSERT SAMPLE RECORDS

-- 1. Stations
INSERT INTO stations (station_id, station_name, station_location)
VALUES (
    2246751,
    'BROWARD RIVER BL BISCAYNE BLVD NR JACKSONVILLE, FL',
    ST_SetSRID(ST_MakePoint(-81.6682, 30.44333889), 4326)
);

-- 2. Data Links 
INSERT INTO data_links (station_id, link_label, link_url, data_type)
VALUES
(2246751, 'Historical data', 'https://docs.google.com/spreadsheets/d/1ssVDRi6AK2B-DNi-Ina4ExJWh7hPaKf3/edit?usp=sharing&ouid=105688830716683241697&rtpof=true&sd=true', 'CSV'),
(2246751, 'Forecasting Data', 'https://drive.google.com/forecast.pdf', 'CSV');