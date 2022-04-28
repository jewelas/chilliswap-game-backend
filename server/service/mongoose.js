const mongoose = require('mongoose')

// Connect to mongodb
const URI = process.env.MONGODB_URL

mongoose.connect(URI, { 
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,            
})
.then(() => {
    console.log("MongoDB successful connection")
})
.catch((err) => {
    console.log("MongoDB connection error", err)
})

const db = mongoose.connection

// Set up database event handlers:
db.on('error', function(err) { 
    console.log("Unable to connect to database.  Error: " + err)
 } )

db.once('open', function() { 
  console.log('Mongoose database connection established.')
})

db.on('disconnected', function() {
  console.log('MongoDB disconnected.  Attempting to reconnect...')
})

db.on('reconnected', function() {
  console.log('Mongoose reconnected.')
})