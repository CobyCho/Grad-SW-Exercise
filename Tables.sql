CREATE DATABASE internet_statistics;
GO

USE internet_statistics;

-- Create Countries Table
CREATE TABLE Countries (
    country_id INT PRIMARY KEY IDENTITY(1,1), -- Auto-increment ID
    country_name VARCHAR(255),
    country_code CHAR(2) -- 2-letter country code
);

-- Create Internet Usage Table
-- CREATE TABLE InternetUsage (
   -- usage_id INT PRIMARY KEY IDENTITY(1,1),
   -- country_id INT,
    --rate_wb FLOAT, -- World Bank Internet Usage Rate
    --year_wb INT, -- Year of World Bank data
    --rate_itu FLOAT, -- ITU Internet Usage Rate
    --year_itu INT, -- Year of ITU data
    --users_cia INT, -- CIA World Factbook Users
    --year_cia INT, -- Year of CIA data
    --FOREIGN KEY (country_id) REFERENCES Countries(country_id)
--);

USE internet_statistics;
GO

-- Step 1: Create the staging table to import data for "countries" dataset
-- The staging table doesn't have the identity column (country_id) which has been making the import of data error
CREATE TABLE countries_staging (
    country_name VARCHAR(255),
    country_code CHAR(2)
);
GO

-- Step 2: Bulk Insert data from the CSV file into the staging table
BULK INSERT countries_staging
FROM 'C:\csvfiles\countries.csv'
WITH (
    FIELDTERMINATOR = ',',  -- Column delimiter (comma for CSV)
    ROWTERMINATOR = '\n',   -- Row delimiter (newline)
    FIRSTROW = 2           -- Skip header row
);
GO


-- Step 3: Insert data from the staging table into the final 'countries' table
-- SQL Server will automatically generate the country_id (identity column) to avoid errors
INSERT INTO Countries (country_name, country_code)
SELECT country_name, country_code
FROM countries_staging;
GO

-- Step 4: Clean up by dropping the staging table
DROP TABLE countries_staging;
GO

