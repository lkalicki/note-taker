const express = require("express");
const fs = require('fs');
const path = require("path");
const notes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));

});

app.post("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    var id = notes[notes.length - 1].id + 1
    var newNote = { title: req.body.title, text: req.body.text, id: id }
    var activeNote = notes.concat(newNote)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), function (error, data) {
      if (error) {
        return error
      }
      console.log(activeNote)
      res.json(activeNote);
    })
  })
})
 
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
    if (error) {
      return console.log(error)
    }

    res.json(JSON.parse(data))
  })
});

app.delete("/api/notes/:id", function (req, res) {
  const noteId = JSON.parse(req.params.id)
  console.log(noteId)
  fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
    if (error) {
      return console.log(error)
    }
    notes = JSON.parse(notes)

    notes = notes.filter(val => val.id !== noteId)

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
      if (error) {
        return error
      }
      res.json(notes)
    })
  })
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});