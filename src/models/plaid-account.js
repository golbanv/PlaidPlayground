const {model, Schema} = require("mongoose")


module.exports = model("PlaidAccount", new Schema({
    accountId:{
        type: String,
        required:true
    },
    mask: String,
    balances:{
available: Number,
current: Number,
limit: Number,
isoCurrencyCode: String,
unoficialCurrencyCode: String
    },
    name: {
        type: String,
        required:true
    },
    officialName:{
        type: String,
        required:true
    },
    subtype:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    },

    
}))