const mongoose = require('mongoose')


const EventSchema = new mongoose.Schema({
    idEvent: {
        type:String,
        required:[true,'must provide a idEvent'],
        trim:true,
        unique:true
    },
    sportType:{
        required:[true,'must provide a sportType'],
        type: String,
        trim:true,
    },
    sportName:{
        required:[true,'must provide a sportName'],
        type: String,
        trim:true,
    },
    homeTeam: { 
        type: String,
        trim:true,
    },
    awayTeam: {
        type: String,
        trim:true,
    },
    homeGoals: { 
        type: Number,
        trim:true,
    },
    awayGoals: {
        type: Number,
        trim:true,
    },
    participants:[{
        type: String,
        trim: true,
    }],
    oddsBet: [{
        type:Number,
        required:[true,'must provide a oddBet']
    }],
    date: {
        type:Date,
        required:[true,'must provide a Date'],
        trim:true
    },
    state: {
        type:Number, //a decorrer ou terminado
        required:[true,'must provide a State'],
        trim:true
    },
    adminUpdate:{
        type: Number,
        required:[true, 'must provide who needs to update'],
        trim:true
    },
    observers:[{
        type: String,
        trim:true
    }]

})


module.exports = mongoose.model('Event', EventSchema)