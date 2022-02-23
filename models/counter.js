const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    self_input: {
        type:Number,
        required: true
    },
    market_borrow: {
        type:Number,
        required: true
    },
    invested_all_time:{
        type:Number,
    },
    recharge:{
        type:Number
    },
    collection_withdraw:{
        type:Number,

    },
    collection_alltime:{
        type:Number,
    }

}, {
    timestamps: true
});


const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;