const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
        self_input: {
            type:Number,
            // required: true
        },
        market_borrow: {
            type:Number,
            // required: true,
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
        },
        available_money:{
            type:Number,
            default:function(){
                return this.self_input+this.market_borrow - this.invested_all_time + this.recharge;
            }
        }
});

const debitinfoSchema = new mongoose.Schema({
    total_debit:{
        type:Number,
    },
    total_return:{
        type:Number,
    },
    total_expected_return:{
        type:Number,
    },
    total_return_diffrence:{
        type:Number,
    },
    total_other_exp:{
        type:Number,
    },
    debitors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Debiitor'
        }
    ]
})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },

    counter: counterSchema,
    debitinfo:debitinfoSchema,
}, {
    timestamps: true
});



const User = mongoose.model('User', userSchema);

module.exports = User;