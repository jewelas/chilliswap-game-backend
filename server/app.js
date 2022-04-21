const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const rateLimit = require("express-rate-limit");

require('./service/mongoose')
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);


//app.options('*', cors());

app.use(cors())
app.use(express.json())

app.use('/api/users',require('./routes/user.routes'))
app.use('/api/auth',require('./routes/auth.routes'))
app.use('/api/setting',require('./routes/setting'))
app.use('/api/character',require('./routes/character.router'))


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
    console.log("CHILLI API server Started on PORT: "+ PORT);
   
});

process.on('unhandledRejection', function(reason, p){
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});
