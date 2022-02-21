module.exports.list = function(req,res){
    res.render('debitors');
}
module.exports.profile = function(req,res){
    res.render('debitor_profile');
}
module.exports.edit = function(req,res){
    res.render('edit_debitor');
}
module.exports.initialise = function(req,res){
    res.render('initialiseCredit_debitors');
}