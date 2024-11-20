-- All inserts, all deletes, all updates

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

-- Select all from Concerts
SELECT * FROM Concerts;

-- Select all from Artists
SELECT * FROM Artists; 

-- Select all form Tours
SELECT * FROM Tours;

-- Select all from ConcertVendorDetails
SELECT * FROM ConcertVendorDetails;

-- Select all from ArtistConcertDetails
SELECT * FROM ArtistConcertDetails;

-- Delete from Concerts based on ID
DELETE FROM Concerts WHERE concertID = :concertID;

-- Insert into ArtistConcertDetails
INSERT INTO ArtistConcertDetails (artistID, concertID) 
VALUES (:artistID, :concertID);

-- Delete from ArtistConcertDetails
DELETE FROM ArtistConcertDetails 
WHERE artistID = :artistID AND concertID = :concertID;

-- Insert into ConcertVendorDetails
INSERT INTO ConcertVendorDetails (concertID, vendorID) 
VALUES (:concertID, :vendorID);

-- Delete from ConcertVendorDetails
DELETE FROM ConcertVendorDetails 
WHERE concertID = :concertID AND vendorID = :vendorID;

-- Delete from Concerts based on ID
DELETE FROM Concerts WHERE concertID = :concertID;

-- Delete from ArtistConcertDetails based on artistID and concertID
DELETE FROM ArtistConcertDetails 
WHERE artistID = :artistID AND concertID = :concertID;

-- Delete from ConcertVendorDetails based on concertID and vendorID
DELETE FROM ConcertVendorDetails 
WHERE concertID = :concertID AND vendorID = :vendorID;

-- Delete from Artists based on artistID
DELETE FROM Artists WHERE artistID = :artistID;

-- Delete from Tours based on tourID
DELETE FROM Tours WHERE tourID = :tourID;

-- Delete from Vendors based on vendorID
DELETE FROM Vendors WHERE vendorID = :vendorID;


-- Update Artist
UPDATE Artists
SET
    artistName = :artistName
WHERE 
    artistID = :artistID;

-- Update Vendors
UPDATE Vendors
SET
    vendorName = :vendorName,
    vendorProduct = :vendorProduct
WHERE
    vendorID = :vendorID;

-- Update Tours
UPDATE Tours 
SET 
    tourName = :tourName,
    tourStartDate = :tourStartDate,
    tourEndDate = :tourEndDate,
    concertTotal = :concertTotal,
    artistName = :artistName
WHERE
    tourID = :tourID


-- Update Concerts
UPDATE Concerts
SET 
    numTicketsAvailable = :numTicketsAvailable,
    numTicketsSold = :numTicketsSold,
    startDate = :startDate,
    location = :location,
    tourID = :tourID
WHERE 
    concertID = :concertID;

-- Update ArtistConcertDetails
UPDATE ArtistConcertDetails
SET 
    artistID = :artistID,
    concertID = :concertID
WHERE
    artistConcertID = :artistConcertID;

-- Update VendorConcertDetails
UPDATE VendorConcertDetails
SET 
    artistID = :artistID,
    concertID = :concertID
WHERE
    artistConcertID = :artistConcertID;



-- Select from Concerts based on artist ID
SELECT * FROM Concerts
JOIN ArtistConcertDetails ON Concert.concertID = ArtstConcertID.concertID
JOIN Artists ON Artists.artistID = ConcertArtistTable.concertID
WHERE Artists.artist_name = :artistName;