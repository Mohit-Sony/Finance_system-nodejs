module.exports.list = function(req,res){
    res.render('creditors');
}
module.exports.profile = function(req,res){
    res.render('creditor_profile');
}
module.exports.edit_profile = function(req,res){
    res.render('edit_creditor');
}
module.exports.initialise = function(req,res){
    res.render('initialiseCredit_creditors');
}
module.exports.home = function(req,res){
    res.render('home');
}