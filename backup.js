const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');


/* 
Basic mongo dump and restore commands, they contain more options you can have a look at man page for both of them.
1. mongodump --db=rbac_tutorial --archive=./rbac.gzip --gzip
2. mongorestore --db=rbac_tutorial --archive=./rbac.gzip --gzip
Using mongodump - without any args:
  will dump each and every db into a folder called "dump" in the directory from where it was executed.
Using mongorestore - without any args:
  will try to restore every database from "dump" folder in current directory, if "dump" folder does not exist then it will simply fail.
*/

const DB_NAME = 'finance';
const ARCHIVE_PATH = path.join(__dirname, 'backup', `${DB_NAME}`);


// 1. Cron expression for every 5 seconds - */5 * * * * *
// 2. Cron expression for every night at 00:00 hours (0 0 * * * )
// Note: 2nd expression only contains 5 fields, since seconds is not necessary

// Scheduling the backup every 5 seconds (using node-cron)
cron.schedule('0 * * * *', () => backupMongoDB());

function backupMongoDB() {
    let current_time = new Date();

  const child = spawn('mongodump', [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}-${current_time.getDate()}-${current_time.getMonth()}-${current_time.getFullYear()}-${current_time.getHours()}-${current_time.getMinutes()}-${current_time.getSeconds()}.gzip`,
    '--gzip',
  ]);

  child.stdout.on('data', (data) => {
    console.log('stdout:\n', data);
  });
  child.stderr.on('data', (data) => {
    console.log('stderr:\n', Buffer.from(data).toString());
  });
  child.on('error', (error) => {
    console.log('error:\n', error);
  });
  child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code);
    else if (signal) console.log('Process killed with signal:', signal);
    else console.log('Backup is successfull ✅');
  });
}