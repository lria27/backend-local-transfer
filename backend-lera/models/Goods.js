const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name:{type: String, required: true},
    score: {type: String, required: true},
    owner: [{type: Types.ObjectId, ref: 'Market'}],
    path: {type: String},
    ownerName:{type: String, required: true}

})
module.exports = model('Goods', schema)