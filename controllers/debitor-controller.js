const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');
const Transaction = require('../models/transactions');


module.exports.list = async function(req,res){
    try {
        let user = await User.findById(req.user.id).populate('debitors');
        console.log(user);
        // console.log(`${Debitors}`);
        return res.render('debitors' , {
            "page_title":"Debitors",
            "current_date":new Date(),
            "debitors_info":user.debitors
        });
        
    } catch (error) {
        console.log(`error debitor list : ${error}`)
        return res.redirect('back');        
    }
}//done with user
module.exports.profile = async function(req,res){
    try {
        console.log(req.params.id);

        debitor_info = await Debitor.findById(req.params.id).populate('transactions');
        if(debitor_info.user_id == req.user.id){
            console.log(`debitor profile : ${debitor_info}`);
            return res.render('debitor_profile',{
                "debitor_info":debitor_info,
                "current_date": new Date()
            });

        }
        else{
            return res.end('unautorised request');
        }
    } catch (error) {
        console.log(`error ${error}`)
        return(res.redirect('/'))
    }
} //done with user
module.exports.edit = async function(req,res){
    try {
        let debitor = await Debitor.findById(req.params.id);
        if(debitor_info.user_id == req.user.id){

            console.log(debitor);
            return res.render('edit_debitor',{
                "page-title":"Edit Debitor",
                "debitor_info":debitor
            });
        }
        else{
            return res.end('unautorised request');
        }
    } catch (error) {
        console.log(`error ${error}`);
        return(res.redirect('/'));
    }
    
}//done with user
module.exports.initialise = function(req,res){
    res.render('initialiseCredit_debitors');
}//done with user
module.exports.new_debitor = function(req,res){
    res.render('new_debitor');
}//done with user
module.exports.post_new_info_init = async function(req,res){
    //to initialise debitor information from form to database
    try {
        console.log(req.body);
        //check if same username exists
        let deb = await Debitor.findOne({
            "general_info.username":req.body["deb-user-name"]
        });
        if(deb){
            console.log(`username exists`);
            return res.redirect('back');
        }
        else{
            let debitor = await Debitor.create({
                user_id:req.user.id,
                general_info:{
                    username: req.body["deb-user-name"],
                    name:req.body["deb-name"] ,
                    number:{
                        1: req.body["deb-mob-1"],
                        2: req.body["deb-mob-2"],
                        3: req.body["deb-mob-3"],
                    },
            
                    shop:req.body["deb-shop"],
                    address:req.body["deb-address"],
                    guarentor_name: req.body["deb-guar-name"] ,
                    guarentor_number: {
                        1: req.body["deb-guar-mob-1"],
                        2: req.body["deb-guar-mob-2"],
                        3: req.body["deb-guar-mob-3"],
                    },
                    comment: req.body["deb-comment"],
                    initialised: false ,
                },
            });
            console.log(debitor);
            let user = await User.findById(req.user.id);
            user.debitors.unshift(debitor);
            user.save();
            console.log(`sucessfully added to debitors in user`)
            return res.redirect('/debitor')


        }


    } catch (error) {
        console.log(`error ${error}`)
        return(res.redirect('/'))
    }


}//done with user
module.exports.post_debit_init = async function(req,res){
    //to initialise debit info - amount amount after intrest from form to database
    try {
        console.log(req.body);
        let user = await User.findById(req.user.id);

        console.log(user.counter.self_input + user.counter.market_borrow + user.counter.collection_alltime - user.counter.market_return - user.counter.invested_all_time - user.counter.withdraw ) ;



        let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
            "general_info.initialised":true,          
            "money.real_debit":req.body['credit-amount'],
            "money.debit_after_intrest":req.body.amount,
            "money.daily_installment_amount": parseInt(parseInt(req.body.amount)/parseInt(req.body.days)) ,
            "money.days_given_init":req.body.days,
            "money.debit_init_date": new Date(),

            
        });
        console.log(`debitor initialised : ${debitor}`);
        let transaction = await Transaction.create({
            user_id:req.user.id,
            amount:req.body['credit-amount'],
            type:"Loan Given w/o int",
            date: new Date() ,
            comment:req.body.comment,
            from: "debitor",
            "person_id_debitor":req.params.id,
            // person_id_Creditor: req.body.:
        })
        debitor.transactions.push(transaction);
        debitor.save();
        user = await User.findByIdAndUpdate(req.user.id,{
            $inc:{
                "counter.invested_all_time":req.body['credit-amount']
            }
        });
        user.transactions.push(transaction);
        user.save();



        return res.redirect('/debitor');

    } catch (error) {
        console.log(`error :${error}`)
        return res.redirect('/debitor');

    }
    

}//done with user
module.exports.make_payment = async function(req,res) {
    try {

        // Debitor.findById(req.params.id);
        console.log(req.body);
        let type = req.body.type;
        console.log(type);
        if(type == "Recived"){
            console.log(`recived money`)
            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                'money.last_payment':new Date(),
                $inc:{
                    'money.returned': parseInt(req.body.amount),
                    
                }
                
            });
            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"recived",
                date: new Date() ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();
            // post.comments.push(comment);
            // post.save();
            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    'counter.collection_alltime' : req.body.amount,
                }
            });
            if(user){
                console.log(user);
            }
            user.transactions.push(transaction);
            user.save();


        }//if payment recived
        else if(type == "penalty"){
            console.log(`penalty `)

            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                $inc:{
                    'money.penalty': parseInt(req.body.amount)
                }
                
            });
            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"penalty",
                date: new Date() ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();
            
            // Debitor.aggregate([
            //     {$match:{
            //     $and: [
            //     { "general_info.initialised": true },
            //     {'user_id': req.user._id }
            //     ]
            //     }},
                

            //     { $group: { _id : null , total: { $sum: "$money.penalty" } } },
            //   ]).exec(function (err, doc) {
            //     if (err) {
            //         console.log( `error in aggrigate ${err} `);
            //         return res.redirect('back');
            //     } else {
            //         console.log(doc);
            //         total_pen = doc[0].total;
            //         console.log(total_pen);
            //         User.findByIdAndUpdate(req.user.id, {
            //             $set:{
            //                 "counter.total_penalty" : total_pen
            //             }
            //         });
            //     }
            // });
            // console.log(total_pen);
            // // let user = await User.findByIdAndUpdate(req.user.id, {
            // //     $set:{
            // //         "counter.total_penalty" : total_pen
            // //     }
            // // });

            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    "counter.total_penalty" : req.body.amount,
                    }
            })



            if(user){
                console.log(user.counter.total_penalty);
            }
            user.transactions.push(transaction);
            user.save();
        }
        else if(type == "discount"){
            let debitor = await Debitor.findByIdAndUpdate(req.params.id,{
                
                $inc:{
                    'money.discount': parseInt(req.body.amount)
                }
                
            });
            let transaction = await Transaction.create({
                user_id:req.user.id,
                amount:req.body.amount,
                type:"discount",
                date: new Date() ,
                comment:req.body.comment,
                from: "debitor",
                "person_id_debitor":req.params.id,
                // person_id_Creditor: req.body.:
            })
            debitor.transactions.unshift(transaction);
            debitor.save();
            let user = await User.findByIdAndUpdate(req.user.id,{
                $inc:{
                    "counter.total_discount" : req.body.amount,
                    }
            })           
            user.transactions.push(transaction);
            user.save();


        }
        console.log('type not matched')
        return res.redirect('back');
    } catch (error) {
        console.log(`error : ${error}`)
        return(res.redirect('back'))
    }
}
module.exports.edit_info_req = async function(req,res){
        //to edit debitor information from form to database
        try {
            console.log(req.body);
            //check if same username exists


                let debitor = await Debitor.findByIdAndUpdate(req.params.id,{

                    "general_info.username" : req.body["deb-user-name"],
                    "general_info.name":req.body["deb-name"] ,
                    "general_info.number":{
                            1: req.body["deb-mob-1"],
                            2: req.body["deb-mob-2"],
                            3: req.body["deb-mob-3"],
                        },
                    "general_info.shop":req.body["deb-shop"],
                    "general_info.address":req.body["deb-address"],
                    "general_info.guarentor_name": req.body["deb-guar-name"] ,
                    "general_info.guarentor_number": {
                            1: req.body["deb-guar-mob-1"],
                            2: req.body["deb-guar-mob-2"],
                            3: req.body["deb-guar-mob-3"],
                        },
                    "general_info.comment": req.body["deb-comment"],

                });
                console.log(debitor);
                let id_str = req.params.id.toString() ;
                console.log(id_str);
                return res.redirect(`/debitor/profile/${req.params.id}`);
    
        } catch (error) {
            console.log(`error ${error}`)
            return(res.redirect('/'))
        }
    
    
    
}
