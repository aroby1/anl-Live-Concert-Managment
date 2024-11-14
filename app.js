var express = require('express');
var app = express();                
PORT = 8599;                        

// Database connection
var db = require('./db-connector');

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('index')
});

// Route for displaying Artists
app.get('/artists', function (req, res) {
    const query = 'SELECT * FROM Artists';
    
    db.pool.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching artists:", err);
            return res.status(500).send("Database error");
        }
        res.render('artists', { artists: results });
    });
});

// Route for displaying Vendors
app.get('/vendors', function (req, res) {
    const query = 'SELECT * FROM Vendors';
    
    db.pool.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching vendors:", err);
            return res.status(500).send("Database error");
        }
        res.render('vendors', { vendors: results });
    });
});

// Route for displaying Concerts
app.get('/concerts', function (req, res) {
    const query = `
        SELECT c.concertID, c.numTicketAvailable, c.numTicketSold, c.startDate, c.location, t.tourName, a.artistName 
        FROM Concerts c 
        JOIN Tours t ON c.tourID = t.tourID
        JOIN Artists a ON t.artistID = a.artistID
    `;
    
    db.pool.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching concerts:", err);
            return res.status(500).send("Database error");
        }
        res.render('concerts', { concerts: results});
    });
});

// Route for displaying Tours
app.get('/tours', function (req, res) {
    const query = `
        SELECT t.tourID, t.tourName, t.tourStartDate, t.tourEndDate, t.concertTotal, a.artistName 
        FROM Tours t 
        JOIN Artists a ON t.artistID = a.artistID
    `;
    
    db.pool.query(query, function (err, results) {
        if (err) {
            console.error("Error fetching tours:", err);
            return res.status(500).send("Database error");
        }
        res.render('tours', { tours: results});
    });
});

app.get('/artistConcert', function (req, res) {
    const query = `
        SELECT ac.artistConcertID, a.artistID, c.concertID
        FROM ArtistConcertDetails ac
        JOIN Artists a ON ac.artistID = a.artistID
        JOIN Concerts c ON ac.concertID = c.concertID;
    `;

    db.pool.query(query, function(err, results) {
        if (err) {
            console.error("Error fetching artistConcert:", err);
            return res.status(500).send("Database error");
        }
        res.render('artistConcert', { artistConcert: results});
    });
});

app.get('/concertVendor', function (req, res) {
    const query = `
        SELECT cv.concertVendorID, v.vendorID, c.concertID
        FROM ConcertVendorDetails cv
        JOIN Vendors v ON cv.vendorID = v.vendorID
        JOIN Concerts c ON cv.concertID = c.concertID;
    `;

    db.pool.query(query, function(err, results) {
        if (err) {
            console.error("Error fetching concertVendor:", err);
            return res.status(500).send("Database error");
        }
        res.render('concertVendor', { concertVendor: results});
    });
});

// Start the server
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});