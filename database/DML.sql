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

-- Select all from Vendors
SELECT * FROM Vendors;

-- Select all from Artists
SELECT * FROM Artists; 

-- Select all form Tours
SELECT * FROM Tours 

-- Select all from ConcertVendorDetails
SELECT * FROM ConcertVendorDetails;

-- Select all from ArtistConcertDetails
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