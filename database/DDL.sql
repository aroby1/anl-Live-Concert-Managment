-- -----------------------------------------------------
-- Data Definition Queries
-- 
-- CS340 Group 119
-- Aiden McCoy
-- Luke Hashbarger
-- -----------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table Artists
-- -----------------------------------------------------

DROP TABLE IF EXISTS Artists ;

CREATE TABLE Artists (
    artistID INT NOT NULL AUTO_INCREMENT,
    artistName VARCHAR(255) NOT NULL,
    PRIMARY KEY(artistID)
);

-- -----------------------------------------------------
-- Table Tours
-- -----------------------------------------------------

DROP TABLE IF EXISTS Tours ;

CREATE TABLE Tours (
    tourID INT NOT NULL AUTO_INCREMENT,
    tourName VARCHAR(255) NOT NULL,
    tourStartDate DATE NOT NULL,
    tourEndDate DATE NOT NULL,
    concertTotal INT NOT NULL,
    artistID INT,
    PRIMARY KEY(tourID),
    FOREIGN KEY(artistID) REFERENCES Artists(artistID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Concerts
-- -----------------------------------------------------

DROP TABLE IF EXISTS Concerts ;

CREATE TABLE Concerts (
    concertID INT NOT NULL AUTO_INCREMENT,
    numTicketAvailable int NOT NULL,
    numTicketSold int NOT NULL,
    startDate DATETIME NOT NULL,
    location FLOAT NOT NULL,
    tourID INT,
    PRIMARY KEY(concertID),
    FOREIGN KEY(tourID) REFERENCES Tours(tourID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Vendors
-- -----------------------------------------------------

DROP TABLE IF EXISTS Vendors ;

CREATE TABLE Vendors (
    vendorID INT NOT NULL AUTO_INCREMENT,
    vendorName VARCHAR(255) NOT NULL,
    vendorProduct VARCHAR(255) NOT NULL,
    PRIMARY KEY(vendorID)
);

-- -----------------------------------------------------
-- Table ConcertVendorDetails
-- -----------------------------------------------------

DROP TABLE IF EXISTS ConcertVendorDetails ;

CREATE TABLE ConcertVendorDetails (
    concertVendorID INT AUTO_INCREMENT,
    vendorID INT NOT NULL,
    concertID INT NOT NULL,
    PRIMARY KEY(concertVendorID),
    FOREIGN KEY(vendorID) REFERENCES Vendors(vendorID) ON DELETE CASCADE,
    FOREIGN KEY(concertID) REFERENCES Concerts(concertID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table ArtistsConcertsDetails
-- -----------------------------------------------------

DROP TABLE IF EXISTS ArtistConcertDetails ;

CREATE TABLE ArtistConcertDetails (
    artistConcertID INT AUTO_INCREMENT,
    artistID INT NOT NULL,
    concertID INT NOT NULL,
    PRIMARY KEY(artistConcertID),
    FOREIGN KEY(artistID) REFERENCES Artists(artistID) ON DELETE CASCADE,
    FOREIGN KEY(concertID) REFERENCES Concerts(concertID) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Insert into Table Artists
-- -----------------------------------------------------

INSERT INTO Artists (`artistID`, `artistName`)
    VALUES 
    ('1', 'Taylor Swift'),
    ('2', 'Tyler the Creator'),
    ('3', 'King Gizzard & The Lizard Wizard'),
    ('4', 'Bruno Mars');

-- -----------------------------------------------------
-- Insert into Table Artists
-- -----------------------------------------------------

INSERT INTO Tours (`tourID`, `tourName`, `artistID`, `tourStartDate`, `tourEndDate`, `concertTotal`)
    VALUES
    ('1', 'Swift As A Coursing River', (SELECT artistID FROM Artists WHERE artistName = 'Taylor Swift'), '2024-10-23', '2024-03-04', '1'),
    ('2', 'Creation', (SELECT artistID FROM Artists WHERE artistName = 'Tyler the Creator'), '2024-12-25', '2025-05-12', '2'),
    ('3', 'Wow a Lizard', (SELECT artistID FROM Artists WHERE artistName = 'King Gizzard & The Lizard Wizard'), '2024-11-22', '2025-04-08', '1'),
    ('4', 'The Moonshine Jungle Tour', (SELECT artistID FROM Artists WHERE artistName = 'Bruno Mars'), '2025-01-15', '2025-03-20', '2');

-- -----------------------------------------------------
-- Insert into Table Concerts
-- -----------------------------------------------------

INSERT INTO Concerts (`concertID`, `numTicketAvailable`, `numTicketSold`, `startDate`, `location`, `tourID`)
    VALUES 
    ('1', 10000, 4000, '2025-12-25 9:00:00', 97068, (SELECT tourID FROM Tours WHERE tourName = 'Creation')),
    ('2', 50000, 29000, '2025-03-04 12:00:00', 97331, (SELECT tourID FROM Tours WHERE tourName = 'Swift As A Coursing River')),
    ('3', 20000, 7000, '2025-01-19 5:00:00', 76043, (SELECT tourID FROM Tours WHERE tourName = 'Creation')),
    ('4', 10000, 6000, '2025-04-08 6:00:00', 97303, (SELECT tourID FROM Tours WHERE tourName = 'Wow a Lizard')),
    ('5', 25000, 23000, '2025-02-10 9:00:00', 10001, (SELECT tourID FROM Tours WHERE tourName = 'The Moonshine Jungle Tour'));

-- -----------------------------------------------------
-- Insert into Table Vendors
-- -----------------------------------------------------

INSERT INTO Vendors (`vendorID`, `vendorName`, `vendorProduct`)
    VALUES 
    ('1', 'Killer Burger', 'Burgers and Fries'),
    ('2', 'Custom T-Shirts', 'T-Shirts'),
    ('3', 'Concert Bartenders', 'Alcholic and Non-Alcholic Drinks');

-- -----------------------------------------------------
-- Insert into Table ConcertVendorDetails
-- -----------------------------------------------------

INSERT INTO ConcertVendorDetails (`concertVendorID`, `vendorID`, `concertID`)
    VALUES 
    ('1', (SELECT vendorID FROM Vendors WHERE vendorName = 'Killer Burger'), (SELECT concertID FROM Concerts WHERE location = '97331')),
    ('2', (SELECT vendorID FROM Vendors WHERE vendorName = 'Custom T-Shirts'), (SELECT concertID FROM Concerts WHERE location = '76043')),
    ('3', (SELECT vendorID FROM Vendors WHERE vendorName = 'Concert Bartenders'), (SELECT concertID FROM Concerts WHERE location = '97303'));

-- -----------------------------------------------------
-- Insert into Table ArtistConcertDetails
-- -----------------------------------------------------

INSERT INTO ArtistConcertDetails (`artistConcertID`, `artistID`, `concertID`)
    VALUES
    ('1', (SELECT artistID FROM Artists WHERE artistName = 'Tyler the Creator'), (SELECT concertID FROM Concerts WHERE location = '97068')),
    ('2', (SELECT artistID FROM Artists WHERE artistName = 'Tyler the Creator'), (SELECT concertID FROM Concerts WHERE location = '76043')),
    ('3', (SELECT artistID FROM Artists WHERE artistName = 'Taylor Swift'), (SELECT concertID FROM Concerts WHERE location = '97331')),
    ('4', (SELECT artistID FROM Artists WHERE artistName = 'Bruno Mars'), (SELECT concertID FROM Concerts WHERE location = '10001'));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

