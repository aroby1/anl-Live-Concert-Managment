-- It should be possible to INSERT entries into every table individually. x
-- Every table should be used in at least one SELECT query. For the SELECT queries, it is fine to just display the content of the tables. x
-- It is generally not appropriate to have only a single query that joins all tables and displays them. x
-- You need to include one DELETE and one UPDATE function in your website, for any one of the entities. x
-- In addition, it should be possible to add and remove things from at least one many-to-many relationship and it should be possible to add things to all relationships. x
-- This means you need SELECT & INSERT functionalities for all relationships as well as entities. x
-- And DELETE & UPDATE for least one M:M relationship. x
-- Put another way, you need a method to SELECT, INSERT, UPDATE and DELETE the rows of an intersection table in your project. x

-- Insert into Artists table
INSERT INTO Artists (artistName) 
VALUES (:artistName);

-- Insert into Tours table
INSERT INTO Tours (tourName, tourStartDate, tourEndDate, concertTotal, artistID) 
VALUES (:tourName, :tourStartDate, :tourEndDate, :concertTotal, :lastArtistID);

-- Insert into Concerts table
INSERT INTO Concerts (numTicketsAvailable, numTicketsSold, startDate, location, tourID) 
VALUES (:numTicketsAvailable, :numTicketsSold, :concertStartDate, :concertLocation, :lastTourID);

-- Insert into Vendors table
INSERT INTO Vendors (vendorName, vendorProduct) 
VALUES (:vendorName, :vendorProduct);

-- Insert into ConcertVendorDetails table
INSERT INTO ConcertVendorDetails (vendorID, concertID) 
VALUES (:lastVendorID, :lastConcertID);

-- Insert into ArtistConcertDetails table
INSERT INTO ArtistConcertDetails (artistID, concertID) 
VALUES (:lastArtistID, :lastConcertID);

SELECT * FROM Vendors;

SELECT * FROM Artists; 

SELECT * FROM Tours 
JOIN Artists ON Tours.artistID = Artists.artistID
WHERE Artists.artistName = :artistName;

SELECT * FROM Vendors;

SELECT * FROM ConcertVendorDetails;

SELECT * FROM ArtistConcertDetails;

SELECT * FROM Concerts
JOIN ArtistConcertDetails ON Concert.concertID = ArtstConcertID.concertID
JOIN Artists ON Artists.artistID = ConcertArtistTable.concertID
WHERE Artists.artist_name = :artistName;

DELETE FROM Concerts WHERE concertID = :concertID;

INSERT INTO ArtistConcertDetails (artistID, concertID) 
VALUES (:artistID, :concertID);

DELETE FROM ArtistConcertDetails 
WHERE artistID = :artistID AND concertID = :concertID;

INSERT INTO ConcertVendorDetails (concertID, vendorID) 
VALUES (:concertID, :vendorID);

DELETE FROM ConcertVendorDetails 
WHERE concertID = :concertID AND vendorID = :vendorID;

UPDATE Concerts
SET 
    numTicketsAvailable = :numTicketsAvailable,
    numTicketsSold = :numTicketsSold,
    startDate = :startDate,
    location = :location,
    tourID = :tourID
WHERE 
    concertID = :concertID;

INSERT INTO ConcertVendorDetails (vendorID, concertID)
VALUES (:vendorID, :concertID);

INSERT INTO ArtistConcertDetails (artistID, concertID)
VALUES (:artistID, :concertID);

