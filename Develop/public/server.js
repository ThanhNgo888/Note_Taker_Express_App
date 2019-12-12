// Dependencies
const express = require('express');
const path = require('path');
const fs = require("fs");
const util = require("uttil");

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//===================================================================================

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

// ================================================================================
//Setting variables to use file system
const writefielAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
let allNotes;
// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
app.get("/notes", function(req, res){
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req,res){
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function(req,res){
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
    .then(function(data){
      return res.json(JSON.parse(data));
    });
});
// ================================================================================
app.post("/api/notes", function(req,res){
  var newNote = req.body;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
    .then(function (data){
      allNotes = JSON.parse(data);
      if(newNote.id || newNote.id === 0){
        let currentNote = allNotes[newNote.id]
        currentNote.title = newNote.title;
        currentNote.text = newNote.text;
      }else{
        allNotes.push(newNote);
      }
      writefielAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
        .then(function(){
          console.log("Writen db.json");
        })
    });
    res.json(newNote);
});

app.delete("/api/notes/:id", function(req,res){
  var id = req.params.id;
  readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
    .then(function(data){
      allNotes = JSON.parse(data);
      allNotes.splice(id, 1);
      writefielAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(allNotes))
        .then(function(){
          console.log("Deleted db.json");
        });
    });
    res.json(id);
});
// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
