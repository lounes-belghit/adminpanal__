const bcrypt = require('bcryptjs');
const password = 'superadmin123';
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);
console.log(hash);
