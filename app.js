
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
const { Router } = require('express');
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
                     res.redirect('meme');
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


// Post route to update record 
app.post('/update', async (req, res) => {
   const updateName = req.body.name;

   Meme.findOne({ "name": req.body.name }, async (err, value) => {
      if (err) console.log(err);
      else {
         var id = value.id;
         var c = value.caption;
         var c1 = req.body.caption;
         var u = value.url;
         var u1 = req.body.url;
         console.log("Updating on this id : ", id);
         var updateMeme = [{
            $set: { "caption": c, caption: c1, "url": u, url: u1 }
         }];
         console.log("caption : ", req.body.caption);
         const record = Meme.updateOne({ _id: id }, updateMeme, function (err, data) {
            if (err) throw err;
            else {
               res.redirect('meme');
               console.log("Record Updated!!!!!");
            }

         });
      }
   })
});


app.listen(3000, () => console.log("Server running on port 3000!"));