const mongoose = require('mongoose');

// const counterSchema = new mongoose.Schema({
//         self_input: {
//             type:Number,
//             // required: true
//             default:0
//         },
//         market_borrow: {
//             type:Number,
//             // required: true,
//             default:0

//         },
//         market_return: {
//             type:Number,
//             // required: true,
//             default:0

//         },
//         invested_all_time:{
//             type:Number,
//             default:0

//         },

//         withdraw:{
//             type:Number,
//             default:0

    
//         },
//         collection_alltime:{
//             type:Number,
//             default:0

//         },
//         // available_money:{
//         //     type:Number,
//         //     default:function(){
//         //         return this.self_input+this.market_borrow - this.invested_all_time + this.collection_alltime;
//         //     }
//         // },

//         total_penalty:{
//             type:Number,
//             default:0

//         },
//         total_discount:{
//             type:Number,
//             default:0

//         },

//         total_expected_return:{
//             type:Number,
//         },
//         total_return_diffrence:{
//             type:Number,
//         },
//         total_other_exp:{
//             type:Number,
//         },

// });



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

    counter:{
        self_input: {
            type:Number,
            // required: true
            default:0
        },
        market_borrow: {
            type:Number,
            // required: true,
            default:0

        },
        market_return: {
            type:Number,
            // required: true,
            default:0

        },
        invested_all_time:{
            type:Number,
            default:0

        },

        withdraw:{
            type:Number,
            default:0


        },
        collection_alltime:{
            type:Number,
            default:0

        },
        // available_money:{
        //     type:Number,
        //     default:function(){
        //         return this.self_input+this.market_borrow - this.invested_all_time + this.collection_alltime;
        //     }
        // },

        total_penalty_imposed:{
            type:Number,
            default:0

        },

        total_penalty_collected:{
            type:Number,
            default:0

        },

        total_discount_imposed:{
            type:Number,
            default:0

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
    },
    
    debitors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Debitor"
        }
    ],
    creditors:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Creditor"
        }
    ],
    
    transactions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Transaction"
        }
    ],
}, {
    timestamps: true
});



const User = mongoose.model('User', userSchema);

module.exports = User;