const mongoose = require('mongoose');

const creditorSchema = new mongoose.Schema({
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
        comment:[
            {
                comment_content : {
                    text:String,
                }
            }
        ]



    },
    money:{
        amount_taken:{
            type:Number
        },
        amount_returned:{
            type:Number
        },
        date_taken:{
            type:Date
        },
        intrest_rate:{
            type:Number,
        },
        duration_months:{
            type:Number,
        }

    },
    transactions:{

    }

}, {
    timestamps: true
});


const Creditor = mongoose.model('Creditor', creditorSchema);

module.exports = Creditor;