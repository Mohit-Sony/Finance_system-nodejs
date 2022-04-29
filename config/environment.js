const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs')
fs.existsSync(logDirectory ) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access_log',{
    interval : '1d',
    path: logDirectory
})

let development = {
    name:'development',
    asset_path:'/assets',
    views_path:'/views',
    session_cookie_key:'blahsomething',
    db:'finance',
    JWT_key:'codeial',
    morgan:{
        mode:'dev',
        options: {stream : accessLogStream}
    }
}
 console.log("finance db", process.env.NODE_ENV) ;
 console.log("finance db", process.env.FINANCE_VIEWS_PATH) ;


let production = {
    name:'production',
    asset_path:process.env.FINANCE_ASSET_PATH,
    views_path:process.env.FINANCE_VIEWS_PATH,
    session_cookie_key: process.env.FINANCE_SESSION_COOKIE_KEY,
    db: process.env.FINANCE_DB_NAME,
    JWT_key:process.env.FINANCE_JWT_KEY,
    morgan:{
        mode:'combined',
        options: {stream : accessLogStream}
    }
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV) ;