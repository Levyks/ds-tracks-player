const fs = require('fs');

const DB_FILE_PATH = './db.json';

class JsonDB {
  constructor() {
    if(fs.existsSync(DB_FILE_PATH)){
      this.data = JSON.parse(fs.readFileSync(DB_FILE_PATH));
    }else {
      this.data = {}
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2));
    } 
  }

  set(key, value) {
    this.data[key] = value;
    return this.writeToJson();
  }

  get(key) {
    return new Promise(resolve => {
      resolve(this.data[key] || null)
    });
  }

  delete(key) {
    delete this.data[key];
    return this.writeToJson();
  }

  list() {
    return new Promise(resolve => {
      resolve(Object.keys(this.data))
    });
  }

  writeToJson() {
    return new Promise((resolve, reject) => {
      fs.writeFile(DB_FILE_PATH, JSON.stringify(this.data, null, 2), err => {
        if(err) reject(err);
        else resolve();
      });    
    })
  }
}

module.exports = JsonDB;