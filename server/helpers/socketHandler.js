const jwt = require('jsonwebtoken');
const socketIo = require("socket.io");

const Guild = require('../models/Guild');

const DsBot = require('../discord/bot');

let io;

const parseCookies = (cookies) => {
  if(!cookies) return {};

  const parsedCookies = {};
  
  cookies = cookies.split(';');

  cookies.forEach(cookie => {
    cookie = cookie.split('=');
    parsedCookies[cookie[0].trim()] = cookie[1].trim();
  });
  
  return parsedCookies;
}

const createIo = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', socket => {
    const handshakeCookies = parseCookies(socket.handshake.headers.cookie);
    const jwtToken = handshakeCookies['jwt-guild-token'];
    try {
      if(!jwtToken) throw({status: 401, message: 'No token provided.'});
      
      jwt.verify(jwtToken, process.env.SECRET, function(err, decoded) {
        if (err) throw({status: 401, message: 'Failed to authenticate token.' });
        
        socket.guildId = decoded.id;
        socket.join(decoded.id);

        socket.emit('connectResponse', {status: 200});
        socket.emit('trackPlayingSync', DsBot.getGuildState(socket.guildId));
        socket.emit('connectedChannelSync', DsBot.getConnectedChannel(socket.guildId));

        socket.on('playTrack', playTrack);
        socket.on('resumeTrack', resumeTrack);
        socket.on('pauseTrack', pauseTrack);
        socket.on('joinVc', joinVc);

      });

    } catch (err) {
      console.log(err);
      if(err.status) {
        socket.emit('connectResponse', err);
        socket.disconnect();
      }
    }
  });
}

function playTrack(data) {
  if(!data.id) return;
  Guild.findFromId(this.guildId).then(guild => {
    if(!guild) return ;
    const track = guild.tracks[data.id];
    if(!track) return;
    
    io.in(this.guildId).emit('trackPlayingSync', {track, state: {status: "loading", currentTime: 0}});
    DsBot.playTrackInGuild(track, this.guildId, handleTrackStart, handleTrackFinish);
  });
}

function resumeTrack() {
  const currentTime = DsBot.resumeTrackInGuild(this.guildId);
  io.in(this.guildId).emit('trackPlayingSync', {state: {status: "playing", currentTime}});
}

function pauseTrack() {
  const currentTime = DsBot.pauseTrackInGuild(this.guildId);
  io.in(this.guildId).emit('trackPlayingSync', {state: {status: "paused", currentTime}});
}

function handleTrackStart() {
  io.in(this.guildId).emit('trackPlayingSync', {state: {status: "playing", currentTime: 0}});
}

function handleTrackFinish() {
  io.in(this.guildId).emit('trackPlayingSync', {state: {status: "finished", currentTime: 0}});
}

function joinVc(data) {
  if(!data.id) return;
  DsBot.joinVoiceChannelFromId(data.id, this.guildId).then(result => {
    console.log(result);
    if(result) io.in(this.guildId).emit('connectedChannelSync', data.id);
  });
}


module.exports = {
  createIo
}