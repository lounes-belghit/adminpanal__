const fs = require('fs');
const hash = fs.readFileSync('hash.txt', 'utf16le').trim();
console.log('HASH_START[' + hash + ']HASH_END');
