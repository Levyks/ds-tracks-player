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

const downloadTrack = (url) => {
  const timestamp = Date.now();
  
  return axios.get(url, {responseType: 'stream' }).then(response => {

    const originalFilename = getFilename(response.headers['content-disposition']);
    const extension = getExtension(originalFilename);

    const filepath = `./temp/${timestamp}.${extension}`;

    const writer = fs.createWriteStream(`${filepath}`);
    const stream = response.data.pipe(writer);

    return new Promise((resolve) => {
      stream.on('finish', () => {
        resolve(filepath);
      });
    });
  
  });
}

const fetchTrackDuration = (url) => {
  if(!url) return false;
  return downloadTrack(url).then(filepath => {
    return loadAudio(filepath).then( buffer => {
      fs.unlink(filepath, () => {});
      return buffer.duration;
    });
  }).catch(err => {
    return false;
  });
}


module.exports = {
  fetchTrackDuration,
  downloadTrack
}