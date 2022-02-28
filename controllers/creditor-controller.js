const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user.id).populate('creditors');
        console.log(user);
        return res.render('creditors' , {
            "page_title":"Credtors",
            "creditors_info":user.creditors
        });
        
    } catch (error) {
        console.log(`error creditor list : ${error}`)
        req.flash(`error`,`Error : ${error}`)

        return res.redirect('back');        
    }
}//done



module.exports.profile = async function(req,res){
    try {
        console.log(req.params.id);
        creditor_info = await Creditor.findById(req.params.id).populate('transactions');
        if(creditor_info.user_id == req.user.id){

            console.log(`creditor profile : ${creditor_info}`);
            return res.render('creditor_profile',{
                "creditor_info":creditor_info,
                "current_date": new Date()
            });
        }
        else{
            req.flash(`error`,`Error : Unauthorised request`)
            return res.end('unautorised request');
        }

    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/')
    }
}//done with user

module.exports.edit_profile = async function(req,res){
    try {
        let creditor = await Creditor.findById(req.params.id);
        if(creditor_info.user_id == req.user.id){
            console.log(creditor);
            return res.render('edit_creditor',{
                "page-title":"Edit Creditor",
                "creditor_info":creditor
            });
        }
        else{
            req.flash(`error`,`Unauthorised Request`)
            return res.redirect('back');
        }
    } catch (error) {
        console.log(`error ${error}`);
        return res.redirect('/') ;
    }
}//done with user


module.exports.initialise = function(req,res){
    res.render('initialiseCredit_creditors');
}//done with user

module.exports.new_creditor = function(req,res){
    res.render('new_creditor');
}//done with user
module.exports.post_new_info_init = async function(req,res){
    //to initialise Creditor information from form to database
    try {
        console.log(req.body);
        //check if same username exists
        let cred = await Creditor.findOne({
            "general_info.username":req.body["cred-user-name"]
        });
        if(cred){
            console.log(`username exists`);
            req.flash(`error`,`Username already exists`)
            return res.redirect('back');
        }
        else{
            let creditor = await Creditor.create({
                user_id:req.user.id,
                general_info:{
                    username: req.body["cred-user-name"],
                    name:req.body["cred-name"] ,
                    number:{
                        1: req.body["cred-mob-1"],
                        2: req.body["cred-mob-2"],
                        3: req.body["cred-mob-3"],
                    },
            
                    shop:req.body["cred-shop"],
                    address:req.body["cred-address"],
                    comment: req.body["cred-comment"],
                    initialised: false ,
                },
            });
            console.log(creditor);
            let user = await User.findById(req.user.id);
            user.creditors.unshift(creditor);
            user.save();
            console.log(`sucessfully added to Creditors in user`)
            req.flash(`sucess`,`sucessfully added to Creditors in user`);

            return res.redirect('/creditor')


        }


    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)

        return(res.redirect('/'))
        
    }


}////done with user

module.exports.post_credit_init_fixed_amount = async function(req,res){
    //to initialise credit info - amount amount after intrest from form to database
    try {
        console.log(req.body);
        let creditor = await Creditor.findByIdAndUpdate(req.params.id,{
            "general_info.initialised":true,          
            "money.amount_taken":req.body['credit-amount'],
            "money.amount_to_be_returned":req.body['amount_return'],
            "money.date_return": new Date(req.body['return_date']),
            "money.date_taken": new Date(req.body['taken_date']),
            "money.type": "fixed_amount",

            
        });
        console.log(`creditor initialised : ${creditor}`);
        let transaction = await Transaction.create({
            user_id:req.user.id,
            amount:req.body['credit-amount'],
            type:"Loan Taken",
            date: new Date() ,
            comment:req.body.comment,
            from: "creditor",
            "person_id_creditor":req.params.id,
            // person_id_Creditor: req.body.:
        })
        creditor.transactions.push(transaction);
        creditor.save();
        let user = await User.findByIdAndUpdate(req.user.id,{
            $inc:{
                "counter.market_borrow" : req.body['credit-amount']
            }
        });
        user.transactions.push(transaction);
        user.save();

        req.flash(`sucess`,`your loan of rupee ${req.body['credit-amount']} sucessfully initialised`);



        return res.redirect('/creditor');

    } catch (error) {
        console.log(`error :${error}`)
        req.flash(`error`,`Error : ${error}`)
        return res.redirect('/creditor');

    }
    

}//done with user
module.exports.edit_info_req = async function(req,res){
    //to edit creditor information from form to database
    try {
        console.log(req.body);
        //check if same username exists


            let creditor = await Creditor.findByIdAndUpdate(req.params.id,{

                "general_info.username" : req.body["cred-user-name"],
                "general_info.name":req.body["cred-name"] ,
                "general_info.number":{
                        1: req.body["cred-mob-1"],
                        2: req.body["cred-mob-2"],
                        3: req.body["cred-mob-3"],
                    },
                "general_info.shop":req.body["cred-shop"],
                "general_info.address":req.body["cred-address"],
                "general_info.comment": req.body["cred-comment"],

            });
            console.log(creditor);
            let id_str = req.params.id.toString() ;
            console.log(id_str);
            req.flash(`sucess`,`creditor information updated`);
            return res.redirect(`/creditor/profile/${req.params.id}`);

    } catch (error) {
        console.log(`error ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('/'))
    }



}//done

module.exports.make_payment = async function(req,res) {
    try {

        // Creditor.findById(req.params.id);
        console.log(req.body);
            console.log(`returned money`)
            let creditor = await Creditor.findByIdAndUpdate(req.params.id,{
                
                'money.last_payment':new Date(),
                $inc:{
                    'money.amount_returned': parseInt(req.body.amount),
                    
                }
                
            });
            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"returned",
                date: new Date() ,
                comment:req.body.comment,
                from: "creditor",
                "person_id_creditor":req.params.id,
            })
            creditor.transactions.unshift(transaction);
            creditor.save();
            let user = await User.findByIdAndUpdate(req.user.id,{
                
                $inc:{
                    'counter.market_return': req.body.amount
                }

            });
            user.transactions.push(transaction);
            user.save();
            req.flash(`sucess`,`payment of rupees ${req.body.amount} successfully returned to creditor`);

        console.log('Sucessfully payment completed')
        console.log
        return res.redirect('back');
    } catch (error) {
        console.log(`error : ${error}`)
        req.flash(`error`,`Error : ${error}`)
        return(res.redirect('back'))
    }
}//done with user