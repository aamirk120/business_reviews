const crypto = require('crypto');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  const [salt, hash] = storedPassword.split(':');

  const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  return newHash === hash;
};


module.exports = { hashPassword, verifyPassword };