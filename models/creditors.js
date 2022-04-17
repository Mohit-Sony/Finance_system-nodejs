const mongoose = require('mongoose');

const creditorSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // default:""
    },
    
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
        initialised:{
            type:Boolean,
            default:false,
        },
        comment:{
            type:String,
        },

    },
    money:{
        amount_taken:{
            type:Number
        },
        amount_returned:{
            type:Number,
            default:0,
        },
        type:{
            type:String,
        },
        date_taken:{
            type:Date
        },
        amount_to_be_returned:{
            type:Number,      
        },
        intrest_rate:{
            type:Number,
        },
        duration_months:{
            type:Number,
        },
        date_return:{
            type:Date,
        },
        last_payment:{
            type: Date,
        },

    },
    credits:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Credit"
        }
    ],
    transactions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Transaction"
        }
    ]

}, {
    timestamps: true
});


const Creditor = mongoose.model('Creditor', creditorSchema);

module.exports = Creditor;