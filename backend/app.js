const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const events = require('./middlewares/events_middleware')
const accounts = require('./middlewares/accounts_middleware')
const observer = require('./middlewares/observer_middleware')
const admin = require('./middlewares/admin_middleware')
const connectDB = require('./db/connect')
const {sync} = require('./controllers/events')


require('dotenv').config();

      //use cors to allow cross origin resource sharing
      app.use(cors({
        origin: ['http://localhost:3001', 'http://localhost:3000']
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())
    

    app.use('/api/events', events)
    app.use('/api/accounts', accounts)
    app.use('/api/observer', observer)
    app.use('/api/admin', admin)

    const start =  async () => {
    
    try{
        
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT,console.log(`Server is listening on port ${process.env.PORT}`))
        sync()
    
    } catch (error){
    
        console.log(error)
    
    }
}

start();