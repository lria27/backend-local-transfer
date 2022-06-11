const {Schema, model} = require('mongoose')

const schema = new Schema({
    goodsName:{type: String, required: true},
    score: {type: String, required: true},
    fromMarket: {type: String, required: true},
    toMarket:{type: String, required: true},
    dateTransit:{type: Date, required: true}
})
module.exports = model('History', schema)