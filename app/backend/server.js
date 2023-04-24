var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var db = mysql.createConnection({
        host:'34.173.6.203',
        user: 'root',
        password:'team064pass',
        database:'flights'
});
db.connect;

var app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

// test query 
app.get('/', function(req, res) {
        var queryTest = db.query('SELECT COUNT(FlightID) AS cCount FROM Flights', function(err, rows, fields) {
                res.send(rows);
                console.log(rows);
        })
});

// advanced query 1
app.get('/api/delay-10', function(req, res) {
        const sqlDelay10 = "SELECT Month, COUNT(*) AS cCount FROM Flights NATURAL JOIN Delays WHERE Airline = 'AA' AND DepartureDelay > 10 GROUP BY Month LIMIT 15";
        db.query(sqlDelay10, (err, result) => {
                res.send(result);
                console.log(err);
        })
});

// advanced query 2
app.get('/api/cancelledDFW-SFO', function(req, res) {
        const sqlDelay10 = "SELECT Airline, COUNT(*) AS cCount FROM Flights NATURAL JOIN Cancellations WHERE Destination = 'DFW' AND Origin = 'SFO' AND Cancelled = 1 GROUP BY Airline LIMIT 15";
        db.query(sqlDelay10, (err, result) => {
                res.send(result);
                console.log(err);
        })
});

// Search for avg airline delay filtered by origin, destination, Month
app.get('/api/airlines-least-delayed', function(req, res) {
        let Origin_ = req.query.Origin;
        let Destination_ = req.query.Destination;
        let Month_ = req.query.Month;

        if (Month_ == 10) { // dont delete this
            Month_ = 9;
        }
    
        const sqlLeastDelay = "SELECT Airline, AVG(ArrivalDelay) as avgDelay FROM Flights NATURAL JOIN Delays WHERE Origin = ? AND Destination = ? AND Month = ? GROUP BY Airline ORDER BY avgDelay LIMIT 5";
        db.query(sqlLeastDelay, [Origin_, Destination_, Month_], (err, result) => {
            res.send(result);
            console.log(err);
        });
});

// Update name
app.put('/api/update-name', function(req, res) {
        const NewFirstName = req.body.NewFirstName;
        const FirstName = req.body.FirstName;
        const LastName = req.body.LastName;

        const sqlNameUpdate = "UPDATE Customer SET First_Name = ? WHERE First_Name = ? AND Last_Name = ?";
        db.query(sqlNameUpdate, [NewFirstName, FirstName, LastName], (err, result) => {
                console.log(err);
        })
});

// add new flight data
app.post('/api/add-data-flights', function(req, res) {
        const FirstName_ = req.body.FirstName;
        const LastName_ = req.body.LastName;
        const Airline_ = req.body.Airline;
        const Origin_ = req.body.Origin;
        const Destination_ = req.body.Destination;
        const Month_ = req.body.Month;

        const sqlInsertCustomer = "INSERT INTO Customer (First_Name, Last_Name) VALUES (?,?)";
        db.query(sqlInsertCustomer, [FirstName_, LastName_], (err, result) => {
                console.log(err);
                console.log(FirstName_, LastName_)
        });
        const sqlInsertFlights = "INSERT INTO Flights (Airline, Origin, Destination, Month) VALUES (?,?,?,?)";
        db.query(sqlInsertFlights, [Airline_, Origin_, Destination_, Month_], (err, result) => {
                console.log(err);
        });
});
//getting latest flightId
app.get('/api/get-flight-id', function(req, res) {
        const sqlFlight = "SELECT MAX(FlightId) AS cCount FROM Flights";
        db.query(sqlFlight, (err, result) => {
                res.send(result);
                console.log(result);
        });
});
// insert data into schedule
app.post('/api/add-data-schedule', function(req, res) {
        const FlightId_ = req.body.FlightId;
        const FirstName_ = req.body.FirstName;
        const LastName_ = req.body.LastName;
        const sqlSchedule = "INSERT INTO Schedule (FlightId, FirstName, LastName) VALUES (?,?,?)";
        db.query(sqlSchedule, [FlightId_, FirstName_, LastName_], (err, result1) => {
                console.log(err);
        });
});  
// insert data into Delays
app.post('/api/add-data-delays', function(req, res) {
        const FlightId_ = req.body.FlightId;
        const DelayTime_ = req.body.DelayTime;
        const sqlDelay = "INSERT INTO Delays (FlightId, ArrivalDelay) VALUES (?,?)";
        db.query(sqlDelay, [FlightId_, DelayTime_], (err, result1) => {
                console.log(err);
        });
}); 
// insert data into Cancelled
app.post('/api/add-data-cancelled', function(req, res) {
        const FlightId_ = req.body.FlightId;
        const Cancelled_ = req.body.Cancelled;
        const sqlCancelled = "INSERT INTO Cancellations (FlightId, Cancelled) VALUES (?,?)";
        db.query(sqlCancelled, [FlightId_, Cancelled_], (err, result1) => {
                console.log(err);
        });
});     


// delete user info
app.delete("/api/delete-user/:firstName/:lastName", (require, response) => {
        // const D_FlightId = require.params.D_FlightId; // convert to string
        const FirstName_ = require.params.firstName;
        const LastName_ = require.params.lastName;
        const sqlSafe = "SET SQL_SAFE_UPDATES = 0"
        const sqlDelete = "DELETE FROM Customer WHERE First_Name = ? AND Last_Name = ?";
        db.query(sqlSafe, (err, result) => {
                console.log(err);
        });
        db.query(sqlDelete, [FirstName_, LastName_], (err, result) => {
            if (err) {
                console.log(err);
                response.status(500).send(err);
            } else {
                response.sendStatus(200);
            }
        });
});

app.listen(3002, function () {
        console.log('Node app is running on port 3002');
});