const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
const db = new sqlite3.Database('warehouseDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});



// Serve the HTML form
app.get('/', (req, res) => {
  res.send(`
    <form action="/search" method="post">
      <input type="text" name="partNumber" placeholder="Enter Part Number">
      <button type="submit">Search</button>
    </form>
  `);
});

// Handle the form submission
app.post('/search', (req, res) => {
  const partNumber = req.body.partNumber;
  const query = `
    SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID)
    FROM PartNumber
    JOIN Bin ON PartNumber.BinID = Bin.BinID
    JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID
    WHERE PartNumber.PartNumber = ?
  `;
  db.get(query, [partNumber], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    res.send(`
      <p>Shelf Number: ${row.ShelfLocation}</p>
      <p>Bin Number: ${row.BinID}</p>
      <p>Count: ${row['COUNT(PartNumber.PartNumberID)']}</p>
    `);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
