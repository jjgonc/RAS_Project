const mongoose = require('mongoose')


const BetSchema = new mongoose.Schema({
    
    eventID:{
        type:String,
        required:['Must provid a ID']
    },
    winner:{
        type:String,
        required:['Must provid a winner']
    },
    odd:{
        type:Number,
        required:['Must provide a odd']
    },
    finished:{
        type:Boolean,
        required:['Must provide a finished state']
    },
    won:{
        type:Boolean,
        required:['Must provide a won state']
    }
})


module.exports = mongoose.model('Bet', BetSchema)