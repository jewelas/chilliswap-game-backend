const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const rateLimit = require("express-rate-limit");


require('./service/mongoose')


// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);


//app.options('*', cors());

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/users',require('./routes/user'))
app.use('/api/auth',require('./routes/auth'))
app.use('/api/artwork',require('./routes/artwork'))
app.use('/api/setting',require('./routes/setting'))

require('./events/transfer')
//require('./events/find')

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found',
    })
  })
  app.use((err, req, res) => {
    res.status(err.status || 500).json({
      message: err.message,
      error: err,
    })
  })
  

//starting server
const PORT = process.env.PORT || 3001
app.listen(PORT, process.env.IP, function () {
    console.log("Kokoswap NFT Started on PORT: "+ PORT);
   
});

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
