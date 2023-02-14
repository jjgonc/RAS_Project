const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,'must provide a username'],
        trim:true,
        unique:true
    },
    password: {
        type:String,
        required:[true,'must provide a password'],
        trim:true,
    },
    mail: {
        type:String,
        required:[true,'must provide a Email'],
        trim:true,
        unique:true
    },
    birth_date: {
        type:Date,
        required:[true,'must provide a birth date'],
        trim:true
    },
    nif: {
        type:String,
        required:[true,'must provide a nif'],
        trim:true
    },
    boletinsID: [{ 
        type:String,
        required:[true,'must provide a nif'],
        trim:true
    }],
    balance: {
        type:mongoose.Types.Decimal128,
        required:[true,'must provide a balance'],
        trim:true
    },
    transactions :[{
        type:String,
        required:[true,'must provide a transaction'],
        trim:true

    }],
    admin:{
        type:Boolean,
        required:[true,'Must provide a admin type']
    },
    notifications:[{
        type:String,
        requeired: [true,'Must provide a notification'],
        trim:true
    }],
    observers: [{
        type:String,
        required:[true,'must provide a followers list'],
        trim:true
    }],
    currency:{
        type:String,
        required:[true, 'must provide a currency'],
        trim:true
    },
    observed: [{
        type:String,
        required:[true,'must provide a following list'],
        trim:true
    }],
    observedEvents: [{
        type:String,
        required:[true,'must provide a following list'],
        trim:true
    }],
    nationality:{
        type:String,
        required:[true,'must provide nationality'],
        trim: true
    }
})


module.exports = mongoose.model('User', UserSchema)