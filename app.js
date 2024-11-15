var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT = 8553;

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

    let query1 = `INSERT INTO Artists (artistName) VALUES ('${data.artistName}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        } else {
            res.redirect('/artists'); 
        }
    });
});

app.post('/add-concert-form', function(req, res) {
    let data = req.body;

    // Fetch the tourID from the Tours table using the provided tourName
    let getTourIDQuery = `SELECT tourID FROM Tours WHERE tourName = '${data.tourName}'`;

    db.pool.query(getTourIDQuery, function(error, rows, fields) {
        if (error || rows.length === 0) {
            console.log("Error finding tourID or tourName does not exist");
            return res.sendStatus(400);  // Bad request if the tourName is not found
        }

        let tourID = rows[0].tourID;  // Get the tourID

        // Now insert the concert into the Concerts table using the correct tourID
        let query1 = `INSERT INTO Concerts (numTicketAvailable, numTicketSold, startDate, location, tourID)
                      VALUES ('${data.ticketsAvailable}', '${data.ticketsSold}', '${data.startDate}', '${parseFloat(data.location)}', '${tourID}')`;

        db.pool.query(query1, function(error, rows, fields) {
            if (error) {
                console.log(error);
                return res.sendStatus(400);  // Bad request if there's an error inserting
            } else {
                res.redirect('/concerts');  // Redirect to the concerts page on success
            }
        });
    });
});



// Start the server
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});