const mongoose = require('mongoose');

const debitorSchema = new mongoose.Schema({
    general_info:{
        username:{
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        number:{
            1:{ type:String },
            2:{ type:String},
            3:{type:String},
        },
        address: {
            type: String,
        },
        shop: {
            type: String,
        },
        guarentor_name: {
            type: String,
        },
        guarentor_number:{
            1:{ type:String },
            2:{ type:String},
            3:{type:String},
        },
        comment:{
            type:String,
        },
        initialised:{
            type:Boolean
        }




    },
    money:{
        real_debit:{
            type:Number,
        },
        debit_after_intrest:{
            type:Number,
        },
        discount:{
            type:Number,
        },
        penalty:{
            type:Number,
        },
        daily_installment_amount:{
            type:Number,
        },
        returned:{
            type:Number,
        }

    },
    transactions:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transactions"
    }

}, {
    timestamps: true
});


const Debitor = mongoose.model('Debitor', debitorSchema);

module.exports = Debitor;