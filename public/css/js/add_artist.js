// // Get the objects we need to modify
// let addArtistForm = document.getElementById('add-person-form-ajax');

// // Modify the objects we need
// addArtistForm.addEventListener("submit", function (e) {
    
//     // Prevent the form from submitting
//     e.preventDefault();

//     // Get form fields we need to get data from
//     let inputArtistName = document.getElementById("input-artistname");


//     // Get the values from the form fields
//     let artistNameValue = inputArtistName.value;

//     // Put our data we want to send in a javascript object
//     let data = {
//         artistName: artistNameValue,
//     }
    
//     // Setup our AJAX request
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", "/add-artist-ajax", true);
//     xhttp.setRequestHeader("Content-type", "application/json");

//     // Tell our AJAX request how to resolve
//     xhttp.onreadystatechange = () => {
//         if (xhttp.readyState == 4 && xhttp.status == 200) {

//             // Add the new data to the table
//             addRowToTable(xhttp.response);

//             // Clear the input fields for another transaction
//             inputArtistName.value = '';
//         }
//         else if (xhttp.readyState == 4 && xhttp.status != 200) {
//             console.log("There was an error with the input.")
//         }
//     }

//     // Send the request and wait for the response
//     xhttp.send(JSON.stringify(data));

// })


// // Creates a single row from an Object representing a single record from 
// // bsg_people
// addRowToTable = (data) => {

//     // Get a reference to the current table on the page and clear it out.
//     let currentTable = document.getElementById("artist-table");

//     // Get the location where we should insert the new row (end of table)
//     let newRowIndex = currentTable.rows.length;

//     // Get a reference to the new row from the database query (last object)
//     let parsedData = JSON.parse(data);
//     let newRow = parsedData[parsedData.length - 1]

//     // Create a row and 4 cells
//     let row = document.createElement("TR");
//     let idCell = document.createElement("TD");
//     let artistCell = document.createElement("TD");

//     // Fill the cells with correct data
//     idCell.innerText = newRow.id;
//     artistCell.innerText = newRow.artistName;


//     // Add the cells to the row 
//     row.appendChild(idCell);
//     row.appendChild(artistCell);
    
//     // Add the row to the table
//     currentTable.appendChild(row);
// }

let addArtistForm = document.getElementById('add-artist-form-ajax');

// Add event listener for form submission
addArtistForm.addEventListener("submit", function (e) {
    e.preventDefault();  // Prevent form from submitting the traditional way

    // Get the artist name from the form
    let inputArtistName = document.getElementById("artistName");
    let artistNameValue = inputArtistName.value;

    // Prepare data to send with AJAX
    let data = { artistName: artistNameValue };
    
    // Setup AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-artist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what to do when the response comes back
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            addRowToTable(xhttp.response);  // Update table with new data
            inputArtistName.value = '';     // Clear input for new entry
        } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
            console.error("There was an error with the input.");
        }
    };

    // Send the AJAX request with data as JSON
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the table
function addRowToTable(data) {
    let currentTable = document.getElementById("artist-table");
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];  // Get the last inserted artist

    // Create a new row and cells for artist data
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let artistCell = document.createElement("TD");

    idCell.innerText = newRow.artistID;
    artistCell.innerText = newRow.artistName;

    // Append cells to the row and row to the table
    row.appendChild(idCell);
    row.appendChild(artistCell);
    currentTable.appendChild(row);
}