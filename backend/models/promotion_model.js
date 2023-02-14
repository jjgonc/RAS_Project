const mongoose = require('mongoose')


const PromotionSchema = new mongoose.Schema({
    promotionType: {
        type:String,
        required:[true,'must provide a type'],
        trim:true,
    },
    initialDate : {
        type:Date,
        required:[true,'must provide a initialDate'],
        trim:true
    },
    endDate: {
        type:Date,
        required:[true,'must provide a endDate'],
        trim:true,
    },
    oddsImprovement: {
        type:Number,
        required:[true,'must provide a odds'],
        trim:true,
    },
    balanceImprovement : {
        type:Number,
        required:[true,'must provide a balance'],
        trim:true,
    }

})


module.exports = mongoose.model('Promotion', PromotionSchema)