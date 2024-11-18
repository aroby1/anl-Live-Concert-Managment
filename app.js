var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const router = express.Router();

PORT = 8544;

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

// Route for displaying Tours
app.get('/tours', function (req, res) {
    let query1 = `
        SELECT t.tourID, t.tourName, t.tourStartDate, t.tourEndDate, t.concertTotal, a.artistName 
        FROM Tours t 
        JOIN Artists a ON t.artistID = a.artistID
    `;

    let query2 = `SELECT * FROM Artists`;
    
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching tours:", error);
            return res.status(400).send("Database error");
        }

        let tour = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let artist = rows;
            res.render('tours', { data: tour, artists: artist });
        })
    });
});

// Route for displaying Concerts
app.get('/concerts', function (req, res) {
    let query1 = `
        SELECT c.concertID, c.numTicketAvailable, c.numTicketSold, c.startDate, c.location, t.tourName, a.artistName 
        FROM Concerts c
        JOIN Tours t ON c.tourID = t.tourID
        JOIN Artists a ON t.artistID = a.artistID
        ORDER BY c.concertID ASC
    `;

    let query2 = `SELECT * FROM Tours`;
    let query3 = `SELECT * FROM Artists`;
    
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching concerts:", error);
            return res.status(400).send("Database error");
        }

        let concerts = rows;

        db.pool.query(query2, function(error, rows, fields) {
            if (error) {
                console.error("Error fetching concerts:", error);
                return res.status(400).send("Database error");
            }

            let tours = rows;

            db.pool.query(query3, function(error, rows, fields) {
                if (error) {
                    console.error("Error fetching concerts:", error);
                    return res.status(400).send("Database error");
                }
    
                let artists = rows;
                res.render('concerts', { data: concerts, tour: tours, artist: artists });
            });
        });
    });
});

//Route for intersection table between Artists and Concerts
app.get('/artistConcert', function (req, res) {
    let query1 = `
        SELECT ac.artistConcertID, ac.artistID, ac.concertID
        FROM ArtistConcertDetails ac;
    `;

    let query2 = `SELECT * FROM Artists`;
    let query3 = `SELECT * FROM Concerts`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.error("Error fetching artist-concerts:", error);
            return res.status(400).send("Database error");
        }

        let data = rows;

        db.pool.query(query2, function(error, rows, fields) {
            if (error) {
                console.error("Error fetching artists:", error);
                return res.status(400).send("Database error");
            }

            let artists = rows;

            db.pool.query(query3, function(error, rows, fields) {
                if (error) {
                    console.error("Error fetching concerts:", error);
                    return res.status(400).send("Database error");
                }

                let concerts = rows;
                res.render('artistConcert', { data: data, artist: artists, concert: concerts });
            });
        });
    });
});

//Route for intersection table between Concerts and Vendors
app.get('/concertVendor', function (req, res) {
    let query1 = `
        SELECT cv.concertVendorID, c.concertID, v.vendorID
        FROM ConcertVendorDetails cv
        JOIN Concerts c ON cv.concertID = c.concertID
        JOIN Vendors v ON cv.vendorID = v.vendorID;
    `;

    let query2 = "SELECT * FROM Vendors";
    let query3 = "SELECT * FROM Concerts";

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.error("Error fetching concertVendor:", error);
            return res.status(400).send("Database error");
        }

        db.pool.query(query2, function (error, vendors, fields) {
            if (error) {
                console.error("Error fetching vendors:", error);
                return res.status(400).send("Database error");
            }

            db.pool.query(query3, function (error, concerts, fields) {
                if (error) {
                    console.error("Error fetching concerts:", error);
                    return res.status(400).send("Database error");
                }
                res.render('concertVendor', { data: rows, vendors: vendors, concerts: concerts });
            });
        });
    });
});


//Post Routes for Forms

//Add Form for Artist
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

//Add Form for Vendor
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


//Add Form for Tour
app.post('/add-tour-form', function (req, res) {
    let data = req.body;

    let concertTotal = parseInt(data.concertTotal);
    if (isNaN(concertTotal)) {
        concertTotal = null;
    }

    let query1 = `
        INSERT INTO Tours (tourName, artistID, tourStartDate, tourEndDate, concertTotal)
        VALUES ('${data.tourName}', ${data.artistName}, '${data.startDate}', '${data.endDate}', ${concertTotal})
    `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log("Error adding tour:", error);
            return res.sendStatus(400);
        } else {
            res.redirect('/tours');
        }
    });
});


//Add Form for Concert
app.post('/add-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);

    let location = parseInt(data.location);
    if (isNaN(location)) {
        location = 'NULL';
    }

    let query1 = `
        INSERT INTO Concerts (numTicketAvailable, numTicketSold, startDate, location, tourID) 
        VALUES 
        ('${data.ticketsAvailable}', '${data.ticketsSold}', '${data.startDate}', ${location}, ${data.tourName})
    `;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/concerts'); 
        }
    });
});


//Add Form for artistConcert Intersection Table
app.post('/add-artist-to-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);

    let artistID = data.artistName; 
    let concertID = data.concertLocation;

    let query1 = `
        INSERT INTO ArtistConcertDetails (artistID, concertID)
        VALUES (${artistID}, ${concertID})
    `;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400); 
        } else {
            res.redirect('/artistConcert'); 
        }
    });
});


//Add Form for vendorConcert Intersection Table
app.post('/add-vendor-at-concert-form', function(req, res) {
    let data = req.body;
    console.log(data);

    let vendorID = data.vendorName;
    let concertID = data.concertLocation;  

    let query1 = `
        INSERT INTO ConcertVendorDetails (vendorID, concertID)
        VALUES (${vendorID}, ${concertID})
    `;

    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        } else {
            res.redirect('/concertVendor');
        }
    });
});

//Server side delete
app.delete('/delete-artist/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM Artists WHERE ArtistID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete artist' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

app.delete('/delete-vendor/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM Vendors WHERE vendorID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete vendor' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

app.delete('/delete-tour/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM Tours WHERE tourID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete tour' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

app.delete('/delete-concert/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM Concerts WHERE concertID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete concert' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

app.delete('/delete-concert-vendor/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM ConcertVendorDetails WHERE concertVendorID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete concertVendor' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

app.delete('/delete-artist-concert/:id', (req, res) => {
    const taskID = parseInt(req.params.id);
    const query1 = 'DELETE FROM ArtistConcertDetails WHERE  artistConcertID = ?';

    db.pool.query(query1, [taskID], (error) => {
        if (error) {
            console.error("Error executing query:", error);
            return res.status(400).send({ error: 'Failed to delete  artistConcert' });
        }
        else{
        res.status(200).json({ status: 'success' });
        }
    });
});

// Start the server
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});

// app.listen(PORT, 'localhost', function () {
//     console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
// });
