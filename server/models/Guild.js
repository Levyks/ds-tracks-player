const DBHelper = require('../helpers/DBHelper');
const db = DBHelper.getDB(process.env.DB_TYPE);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_TOKEN_EXPIRATION = 3600;

class Guild {

  update(data) {
    this.id = data.id;
    this.name = data.name;
  }

  save() {
    return db.get('guilds').then(guilds => {
      if(!guilds) guilds = {};
      guilds[this.id] = this;
      return db.set('guilds', guilds);
    });
  }

  setPassword(password) {
    return bcrypt.hash(password, saltRounds).then((hash) => {
      this.password = hash;
    });
  }

  generateJwt() {
    return jwt.sign({ id: this.id }, process.env.SECRET, {
      expiresIn: JWT_TOKEN_EXPIRATION
    });
  }

  authenticate(password) {
    return bcrypt.compare(password, this.password);
  }

  static findFromId(id) {
    return db.get('guilds').then(guilds => {
      if(!guilds[id]) return false;

      return Object.assign(new Guild(), guilds[id]);
    });
  }
}

module.exports = Guild;