const axios = require('axios');
const fs = require('fs');
const loadAudio = require('audio-loader');

const getFilename = (contentHeader) => {
  if(!contentHeader) return false;
  if(contentHeader.includes(';')) contentHeader = contentHeader.split(';');
  let filename = contentHeader.find(e => e.trim().startsWith('filename='));
  filename = filename.split('=')[1];
  return filename.slice(1, -1);
}

const getExtension = (filename) => {
  if(!filename.includes('.')) return filename;
  filename = filename.split('.');
  return filename[filename.length - 1];
}

const downloadTrack = (url, guildId, trackId) => {
  return axios.get(url, {responseType: 'stream' }).then(response => {

    const originalFilename = getFilename(response.headers['content-disposition']);
    const extension = getExtension(originalFilename);

    const path = `./tracks/${guildId}`;
    const filepath = `${path}/${trackId}.${extension}`;

    fs.mkdirSync(path, { recursive: true });

    const writer = fs.createWriteStream(`${filepath}`);
    const stream = response.data.pipe(writer);

    return new Promise((resolve) => {
      stream.on('finish', () => {
        resolve(filepath);
      });
    });
  
  });
}

const fetchTrackDuration = (url, guildId, trackId) => {
  if(!url) return false;
  return downloadTrack(url, guildId, trackId).then(filepath => {
    return loadAudio(filepath).then( buffer => {
      if(process.env.CACHE_TRACKS != 'true') fs.unlink(filepath, () => {});
      return {duration: buffer.duration, filepath};
    });
  }).catch(err => {
    return false;
  });
}

module.exports = {
  fetchTrackDuration,
  downloadTrack
}

if(process.env.CACHE_TRACKS == 'true') {
  const DBHelper = require('../helpers/DBHelper');
  const db = DBHelper.getDB();
  
  db.get('guilds').then(guilds => {
    Object.values(guilds).forEach(guild => {
      Object.values(guild.tracks).forEach(track => {
        downloadTrack(track.url, guild.id, track.id).then(filepath => {
          guilds[guild.id].tracks[track.id].filepath = filepath;
          db.set('guilds', guilds);
        });
      });
    });
  });
}