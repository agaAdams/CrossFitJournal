var express = require("express"), //zum Aufbau eines Expressservers
    http = require("http"), //um Verbindungen über http zu ermöglichen
    mongoose = require("mongoose"), //um auf die MongoDB zuzugreifen
    app = express(),
    bodyParser = require("body-parser"); //um json-Objekte zu dekodieren
    
app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({"extended" : "true"}));

//Connect to mongoDB
mongoose.connect("mongodb://localhost/crossfit");

// Mongoose Model for Exercises
var ExerciseSchema = mongoose.Schema({
    "name" : String,
    "type" : String
});

var Exercise = mongoose.model("Exercise", ExerciseSchema);

// Mongoose Model für Einträge
var EntrySchema = mongoose.Schema({
    "wod_date" : Date,
    "exercises" : [
        {
            "ex_name" : String,
            "distance" : Number,
            "distance_unit" : String,
            "weight" : Number,
            "ex_reps" : Number,
            "cal" : Number,
            "ex_time" : Number
        }
    ],
    "entry_time" : Number,
    "entry_rounds" : Number,
    "entry_comment" : String
});

var Entry = mongoose.model("Entry", EntrySchema);

// Create our Express-powered HTTP server
http.createServer(app).listen(3000);
console.log("running on localhost:3000");

//establish routes for exercises collection
app.get("/exercises.json", function (req, res) {
    Exercise.find({}, function (err, exercises) {
        exercises = exercises.sort({name:1});
        res.json(exercises);
    });
});

app.post("/exercises", function (req, res) {
    var newExercise = new Exercise({"name":req.body.name, "type":req.body.type});
    newExercise.save();
});

//establish routes for entries collection
app.get("/entries.json", function (req, res) {
    Entry.find({}, function (err, entries) {
        // entries = entries.sort({name:1});
        res.json(entries);
    });
});

app.post("/entries", function (req, res) {
    var newEntry = new Entry({
        "wod_date":req.body.wod_date,
        // "entry_time_start":req.body.entry_time_start,
        // "entry_time_end":req.body.entry_time_end,
        "entry_comment":req.body.entry_comment,
        "entry_time":req.body.entry_time,
        "exercises":req.body.exercise_entries,
        "entry_rounds":req.body.entry_rounds});
    newEntry.save();
});
