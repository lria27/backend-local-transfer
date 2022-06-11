const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name:{type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, default: 'Market' },
    goods: [{type: Types.ObjectId, ref: 'Goods'}]

})
module.exports = model('Market', schema)