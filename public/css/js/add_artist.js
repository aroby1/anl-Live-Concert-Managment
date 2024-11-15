// Get the form element
let addArtistForm = document.getElementById('add-artist-form');

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
    row.dataset.id = newRow.artistID;

    let idCell = document.createElement("TD");
    let artistCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.artistID;
    artistCell.innerText = newRow.artistName;

    // Create edit and delete links
    let editLink = document.createElement("A");
    editLink.href = `/artists/${newRow.artistID}/edit`;
    editLink.innerText = "Edit";

    let deleteLink = document.createElement("A");
    deleteLink.href = "#";
    deleteLink.classList.add("delete-btn");
    deleteLink.innerText = "Delete";
    deleteLink.onclick = () => deleteArtist(newRow.artistID);

    // Append links to cells
    editCell.appendChild(editLink);
    deleteCell.appendChild(deleteLink);

    // Append cells to the row and row to the table
    row.appendChild(idCell);
    row.appendChild(artistCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    currentTable.appendChild(row);
}

