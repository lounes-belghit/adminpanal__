const fs = require('fs');
const bcrypt = require('bcryptjs');
const password = 'superadmin123';
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);
fs.writeFileSync('hash_final.txt', hash, 'utf8');
console.log('Done');
