
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
app.use(express.json());

app.get('/', function (req, res) {
   res.render('feed');
});


app.set('view engine', 'ejs');
app.set('views', './views');

//for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

//for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('feed'));
app.use(express.static(__dirname + '/'));
app.use(express.static('views'));

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/XMeme', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var xmemeSchema = mongoose.Schema({
   name: String,
   caption: String,
   url: String,
   image: String
});

var Meme = mongoose.model('xmeme', xmemeSchema);

app.post('/submit', function (req, res) {
   var memeInfo = req.body; //Get the parsed information

   if (!req.body.name || !req.body.caption || !req.body.url) {
      res.status("400");
      res.send("Invalid details!");
   } else {
      Meme.findOne({ "name": req.body.name }, function (err, value) {
         if (err) console.log(err);
         else {
            if (value == null || value == undefined) {
               var newMeme = new Meme({
                  "name": memeInfo.name,
                  "caption": memeInfo.caption,
                  "url": memeInfo.url
               });
               //Saving Meme data to database
               newMeme.save(function (err, newMeme) {
                  if (err) return console.error(err);
                  else {
                     res.render('feed');
                  }
               });
            }
            else
               console.log("Record already exit");

         }

      });
   }
});

app.get('/meme', async function (req, res) {
   var values = [];
   Meme.find(function (err, response) {
      if (err) console.log("error", err);
      else {
         var i;
         for (i = 0; i < 10; i++) {
            console.log(response[i]);
            if (response[i] != undefined) {
               values[i] = response[i];
               console.log(values[i], "values i");
            }
         }
         console.log(values);
         res.render('feed', { values });
      }
   })
});

//////////////111111111111
//Updating Record in database

// app.post('/update', (req, res) => {
//    //console.log(req,"session");
//    const meme = new Meme({
//       name: req.body.id,
//       caption: req.body.caption,
//       url: req.body.url,
//    });
//    Meme.updateOne({ _id: req.params.id }, meme).then(
//       () => {
//          res.status(201).json({
//             message: 'Thing updated successfully!'
//          });
//       }
//    ).catch(
//       (error) => {
//          res.status(400).json({
//             error: error
//          });
//       }
//    );
// });

app.post('/update', function (req, res) {
   var memeInfo = req.body; //Get the parsed information

   if (!req.body.name || !req.body.caption || !req.body.url) {
      res.status("400");
      res.send("Invalid details!");
   } else {
      Meme.findOne({ "name": req.body.name }, function (err, value) {
         if (err) console.log(err);
         else {
            if (value == null || value == undefined) {
               var updateMeme = new Meme(
                  {
                     "name": memeInfo.name,
                     "caption": memeInfo.caption,
                     "url": memeInfo.url
                  });
               //Saving Meme data to database
               Meme.updateOne({ "name":memeInfo.name  }, updateMeme).then(
                  function () {
                     res.status(201).json({
                        message: 'Thing updated successfully!'
                     });
                     res.render('/');
                  }
               ).catch(
                  (error) => {
                     res.status(400).json({
                        error: error
                     });
                  }
               );

               }
            }
      });
   }
})

//Deleting Record from database

// Meme.findOneAndRemove({ name: "Saiyam" }, function (err, response) {
//    console.log(response);
// });

app.delete('/delete/:id', function (req, res) {
   Meme.findByIdAndRemove(req.params.id, function (err, response) {
      if (err) res.json({ message: "Error in deleting record id " + req.params.id });
      else res.json({ message: "Person with id " + req.params.id + " removed." });
   });
});


app.listen(3000, () => console.log("Server running on port 3000!"));