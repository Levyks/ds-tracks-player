const getDB = (type = process.env.DB_TYPE) => {
  let db;
  switch(type) {
    case 'json':
      db = require('./JsonDB');
      break;
    case 'replit':
      db = require("@replit/database");
      break;
    default:
      break;
  }
  return new db();
}

module.exports = {getDB};