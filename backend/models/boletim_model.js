const mongoose = require('mongoose')


const BoletimSchema = new mongoose.Schema({

    BetsId: [{
        type:String,
        required:[true,'must provide Bets'],
    }],
    finalOdd: {
        type:Number,
        required:[true,'must provide a final odd']
    },
    amountBet: {
        type:Number, 
        required:[true,'must provide a amount bet'],
        trim:true
    },
    date: {
        type:Date,
        required:[true,'must provide a Date'],
        trim:true
    },
    simples:{
        type:Boolean,
        required:['Must provide a bet type']
    },
    userId:{
        type:String,
        required:['Must provide a userID type']
    },
    finished:{
        type:Boolean,
        required:['Must provide a finished state']
    },
    won:{
        type:Boolean,
        required:['Must provide a won state']
    },
    copied_from:{
        type:String,
        required:[false, 'Must provide a copied_from state'],
        trim:true
    },
    currency:{
        type:String,
        required:[true, 'Must provide a currency'],
        trim:true
    }
})


module.exports = mongoose.model('Boletim', BoletimSchema)