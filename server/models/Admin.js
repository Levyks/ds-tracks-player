const DBHelper = require('../helpers/DBHelper');
const db = DBHelper.getDB(process.env.DB_TYPE);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_TOKEN_EXPIRATION = 3600;

class Admin {

  authenticate(password) {
    return bcrypt.compare(password, this.password);
  }

  generateJwt() {
    return jwt.sign({ id: this.id }, process.env.SECRET, {
      expiresIn: JWT_TOKEN_EXPIRATION
    });
  }

  static findFromUsername(username) {
    return db.get('admins').then(admins => {
      if(!admins[username]) return false;

      return Object.assign(new Admin(), admins[username]);
    });
  }
}

module.exports = Admin;