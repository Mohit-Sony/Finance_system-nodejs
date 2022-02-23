const User = require('../models/user');
const Creditor = require('../models/creditors');
const Debitor = require('../models/debitors');


module.exports.list = async function(req,res){
    try {
        let Debitors = await Debitor.find({});
        console.log(`${Debitors}`);
        return res.render('debitors' , {
            "page_title":"Debitors",
            "debitors_info":Debitors
        });
        
    } catch (error) {
        console.log(`error : ${error}`)        
    }
}
module.exports.profile = async function(req,res){
    try {
        console.log(req.params.id);
        debitor_info = await Debitor.findById(req.params.id);
        console.log(`debitor profile : ${debitor_info}`);
        return res.render('debitor_profile',{
            "debitor_info":debitor_info
        });
    } catch (error) {
        console.log(`error ${error}`)
        return(res.redirect('/'))
    }
}
module.exports.edit = function(req,res){
    res.render('edit_debitor');
}
module.exports.initialise = function(req,res){
    res.render('initialiseCredit_debitors');
}
module.exports.new_debitor = function(req,res){
    res.render('new_debitor');
}
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
                },
                initialised: false ,
            });
            console.log(debitor);
            res.redirect('/debitor')


        }


    } catch (error) {
        console.log(`error ${error}`)
        return(res.redirect('/'))
    }


}

module.exports.post_debit_init = function(req,res){
    //to initialise debit info - amount amount after intrest from form to database
    

}