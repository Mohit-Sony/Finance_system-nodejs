const mongoose = require('mongoose');
const env = require('./environment');

mongoose.connect(`mongodb+srv://${env.db_username}:${env.db_password}@finance-production.d9kgx.mongodb.net/${env.db_name}?retryWrites=true&w=majority`);

const db = mongoose.connection;


db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;