app.use(express.static('/'));
app.use(bodyParser.json());
const update = Meme.querySelector('.btn')
//Upadating Meme data according to ID
update.addEventListener('click', _ => {
    fetch('/update', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: "memeInfo.caption",
        url: "memeInfo.url"
      })
    })
  });

  app.put('/update', (req, res) => {
    console.log(req.body)
  })

  newMeme.findOneAndUpdate(
    { name: "Satyam Patidar" },
    {
      $set: {
        caption: req.body.caption,
        url: req.body.url
      }
    },
    options
  )
    .then(result => {/* ... */})
    .catch(error => console.error(error))
    // //Upadating Meme data according to ID
// app.use(bodyParser.json());
// const update = memeInfo.querySelector('.btn')
// update.addEventListener('click', _ => {
//     fetch('/update', {
//       method: 'put',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         caption: "memeInfo.caption",
//         url: "memeInfo.url"
//       })
//     })
//   });

//   app.put('/update', (req, res) => {
//     console.log(req.body)
//   })

//   db.findOneAndUpdate(
//     { name: "Satyam Patidar" },
//     {
//       $set: {
//         caption: req.body.caption,
//         url: req.body.url
//       }
//     },
//     options
//   )
//     .then(result => {/* ... */})
//     .catch(error => console.error(error))