const bcrypt = require('bcrypt');

const encryptPassword = (plainPassword) => {
  const encrptPassword = bcrypt.hashSync(plainPassword, 10);
  return encrptPassword;
};

const decryptPassword = (plainPassword, encryptPassword) => {
  const encrptPassword = bcrypt.compareSync(plainPassword, encryptPassword);
  return encrptPassword;
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
