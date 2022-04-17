const User = require('../models/user');
const Transaction = require('../models/transactions');

module.exports.user_counter = async function(user_id){
    try {
        let user = await User.findById(user_id);
        if(user){
            
        let hisab_data = await Transaction.aggregate([
            {
                $match:{ user_id: user_id}
            },
            {
                $group:{
                    _id:"$type",
                    total_amount:{$sum:"$amount"}
                }
            }
        ]);

        let hisab_show = {}

        function get_value_infield(field_name){
            if(hisab_data.find(o => o._id === `${field_name}`)){
                return hisab_data.find(o => o._id ===`${field_name}`).total_amount ; 
            }else{
                return 0;
            }
        }

        hisab_show['total_discount_imposed'] = get_value_infield('Discount');
        hisab_show['collection_alltime'] = get_value_infield('Recived Debitor');
        hisab_show['invested_all_time'] = get_value_infield('Loan Given Actual Amount');
        hisab_show['total_penalty_collected'] = get_value_infield('Penalty Collected');
        hisab_show['total_penalty_imposed'] = get_value_infield('Penalty Imposed');
        hisab_show['market_return'] = get_value_infield('Returned to Creditor');
        hisab_show['market_borrow'] = get_value_infield('Loan Taken');
        hisab_show['self_input'] = get_value_infield('Self Input');
        hisab_show['withdraw'] = get_value_infield('Withdraw');

            return(hisab_show);

        }
        else{
            req.flash(`error`,`User not found`)
            console.log(`user not found`)
        }
    } catch (error) {
        console.log(error);
        req.flash(`error`,`Error : ${error}`)
        res.redirect('back')
    }

}


module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user._id);
        if(user){
            
        let hisab_data = await Transaction.aggregate([
            {
                $match:{ user_id: req.user._id}
            },
            {
                $group:{
                    _id:"$type",
                    total_amount:{$sum:"$amount"}
                }
            }
        ]);

        // console.log(`this is user tansaction aggrigate data **************** ${data}`);

        let hisab_show = {}

        function get_value_infield(field_name){
            if(hisab_data.find(o => o._id === `${field_name}`)){
                return hisab_data.find(o => o._id ===`${field_name}`).total_amount ; 
            }else{
                return 0;
            }
        }

        hisab_show['total_discount_imposed'] = get_value_infield('Discount');
        hisab_show['collection_alltime'] = get_value_infield('Recived Debitor');
        hisab_show['invested_all_time'] = get_value_infield('Loan Given Actual Amount');
        hisab_show['total_penalty_collected'] = get_value_infield('Penalty Collected');
        hisab_show['total_penalty_imposed'] = get_value_infield('Penalty Imposed');
        hisab_show['market_return'] = get_value_infield('Returned to Creditor');
        hisab_show['market_borrow'] = get_value_infield('Loan Taken');
        hisab_show['self_input'] = get_value_infield('Self Input');
        hisab_show['withdraw'] = get_value_infield('Withdraw');



        console.log('hisab data :', hisab_data);
        console.log('hisab show :', hisab_show);


            console.log(user);
            res.render('statistics',{
                "page-title":"statistics",
                "user_info":user,
                "data":hisab_show,
            });

        }
        else{
            req.flash(`error`,`User not found`)
            console.log(`user not found`)
        }
    } catch (error) {
        console.log(error);
        req.flash(`error`,`Error : ${error}`)
        res.redirect('back')
    }

}