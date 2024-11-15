var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const router = express.Router();

PORT = 8543;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');
app.use(express.static('public'));

/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.render('index')
});

// Route for displaying Artists
app.get('/artists', function (req, res) {
    let query = 'SELECT * FROM Artists';
    
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching artists:", err);
            return res.status(400).send("Database error");
        }
        res.render('artists', { data: rows });
    });
});

// Route for displaying Vendors
app.get('/vendors', function (req, res) {
    let query = 'SELECT * FROM Vendors';
    
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching vendors:", error);
            return res.status(400).send("Database error");
        }
        res.render('vendors', { data: rows });
    });
});

// Route for displaying Concerts
app.get('/concerts', function (req, res) {
    let query = `
        SELECT c.concertID, c.numTicketAvailable, c.numTicketSold, c.startDate, c.location, t.tourName, a.artistName 
        FROM Concerts c
        JOIN Tours t ON c.tourID = t.tourID
        JOIN Artists a ON t.artistID = a.artistID
        ORDER BY c.concertID ASC
    `;
    
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching concerts:", error);
            return res.status(400).send("Database error");
        }
        res.render('concerts', { data: rows });
    });
});

// Route for displaying Tours
app.get('/tours', function (req, res) {
    const query = `
        SELECT t.tourID, t.tourName, t.tourStartDate, t.tourEndDate, t.concertTotal, a.artistName 
        FROM Tours t 
        JOIN Artists a ON t.artistID = a.artistID
    `;
    
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching tours:", error);
            return res.status(400).send("Database error");
        }
        res.render('tours', { data: rows });
    });
});

app.get('/artistConcert', function (req, res) {
    let query = `
        SELECT ac.artistConcertID, a.artistID, c.concertID
        FROM ArtistConcertDetails ac
        JOIN Artists a ON ac.artistID = a.artistID
        JOIN Concerts c ON ac.concertID = c.concertID;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching artistConcert:", error);
            return res.status(400).send("Database error");
        }
        res.render('artistConcert', { data: rows });
    });
});

app.get('/concertVendor', function (req, res) {
    let query = `
        SELECT cv.concertVendorID, v.vendorID, c.concertID
        FROM ConcertVendorDetails cv
        JOIN Vendors v ON cv.vendorID = v.vendorID
        JOIN Concerts c ON cv.concertID = c.concertID;
    `;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching concertVendor:", error);
            return res.status(400).send("Database error");
        }
        res.render('concertVendor', { data: rows });
    });
});

//Post Routes for Forms

app.post('/add-artist-form', function(req, res) {
    let data = req.body;

    let query1 = `INSERT INTO Artists (artistName) VALUES ('${data['artistName']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        } else {
            res.redirect('/artists'); 
        }
    });
});

app.post('/add-vendor-form', function(req, res) {
    let data = req.body;

    let query1 = `INSERT INTO Vendors (vendorName, vendorProduct) VALUES ('${data['vendorName']}', '${data['vendorProduct']}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        } else {
            res.redirect('/vendors'); 
        }
    });
});

app.post('/add-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);

    let location = parseInt(data.location);
    if (isNaN(location))
        {
            location = 'NULL'
        }

    let query1 = `INSERT INTO Concerts (numTicketAvailable, numTicketSold, startDate, location, tourID) 
                  VALUES ('${data['ticketsAvailable']}', '${data['ticketsSold']}', '${data['startDate']}', '${location}',
                  (SELECT tourID FROM Tours WHERE tourName = '${data.tourName}'))`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/concerts'); 
        }
    });
});

app.post('/add-tour-form', function(req, res) {
    let data = req.body;
    console.log(data);

    let concertTotal = parseInt(data.concertTotal);
    if (isNaN(concertTotal))
        {
            concertTotal = 'NULL'
        }

    let query1 = `INSERT INTO Tours (tourName, artistID, tourStartDate, tourEndDate, concertTotal)
                  VALUES ('${data['tourName']}', (SELECT artistID FROM Artists WHERE artistName = '${data.artistName}'),
                  '${data['startDate']}', '${data['endDate']}', '${concertTotal}')`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/tours'); 
        }
    });
});

app.post('/add-artist-to-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);
    
    let concertLocation = parseInt(data.concertLocation);
    if (isNaN(concertLocation))
        {
            concertLocation = 'NULL'
        }

    let query1 = `INSERT INTO ArtistConcertDetails (artistID, concertID)
                  VALUES
                  ((SELECT artistID FROM Artists WHERE artistName = '${data['artistName']}'), (SELECT concertID FROM Concerts WHERE location = ${concertLocation}))`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/artistConcert'); 
        }
    });
});

app.post('/add-vendor-at-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);
    
    let concertLocation = parseInt(data.concertLocation);
    if (isNaN(concertLocation))
        {
            concertLocation = 'NULL'
        }

    let query1 = `INSERT INTO ConcertVendorDetails (vendorID, concertID)
                  VALUES
                  ((SELECT vendorID FROM Vendors WHERE vendorName = '${data['vendorName']}'), (SELECT concertID FROM Concerts WHERE location = ${concertLocation}))`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/concertVendor'); 
        }
    });
});


// Start the server
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});
