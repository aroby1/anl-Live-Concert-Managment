var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8555;   

// Database
var db = require('./db-connector')

app.use(express.static('public'));

/*
    ROUTES
*/
app.get('/', function(req, res) {
    // Define the queries
    const query1 = 'DROP TABLE IF EXISTS diagnostic;';
    const query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
    const query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working for myONID!")'; //replace with your ONID
    const query4 = 'SELECT * FROM diagnostic;';

    // Execute every query in an asynchronous manner
    db.pool.query(query1, function (err, results, fields) {
        db.pool.query(query2, function(err, results, fields) {
            db.pool.query(query3, function(err, results, fields) {
                db.pool.query(query4, function(err, results, fields) {
                    // Send the results to the browser
                    let base = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ANL-Live Managment</title>
                        <link rel="stylesheet" href="/css/style.css">
                    </head>
                    <body>

                        <!-- Header Section -->
                        <header class="header">
                            <h1>Welcome to AnL Live Concert Managment System! </h1>
                        </header>

                        
                        <!-- Navbar -->
                        <nav>
                            <a href="/">Home</a>
                            <a href="/artist">Artists</a>
                            <a href="/vendor">Vendors</a>
                            <a href="/concert">Concerts</a>
                            <a href="/tour">Tours</a>

                        </nav>

                        <!-- Main Content -->
                        <div class="container">
                            <h2>Database Query Results:</h2>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>Text</th>
                                </tr>`;

                    // Dynamically add rows from the query result
                    results.forEach(row => {
                        base += `
                        <tr>
                            <td>${row.id}</td>
                            <td>${row.text}</td>
                        </tr>`;
                    });

                    base += `
                            </table>
                        </div>

                    </body>
                    </html>
                    `;

                    res.send(base);
                });
            });
        });
    });
});


// Start the server
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu/' + PORT + '; press Ctrl-C to terminate.');
});