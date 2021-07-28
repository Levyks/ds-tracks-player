const Discord = require('discord.js');

const Guild = require('../models/Guild');

const client = new Discord.Client();
client.login(process.env.DS_BOT_TOKEN);

const DEFAULT_VOLUME = 1;

const getAllGuildsFormatted = () => {
  const guildsFormatted = [];

  client.guilds.cache.forEach(guild => {

    Guild.findFromId(guild.id).then(foundGuild => {
      let guildObj = foundGuild || new Guild();
      guildObj.update(guild);
      guildObj.save();
    });

    guildsFormatted.push({
      id: guild.id,
      name: guild.name,
      iconUrl: guild.iconURL()
    });

  });

  return guildsFormatted;
};

const getVoiceChannelsFromGuild = (id) => {
  const guild = client.guilds.cache.get(id);
  if(!guild) return false;

  const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');

  return voiceChannels
    .sort((a, b) => a.rawPosition > b.rawPosition ? 1 : -1)
    .map(vc => { return {
      id: vc.id,
      name: vc.name
    }});
  
}

guildsStates = {};

const joinVoiceChannelFromId = (id, guildId = false) => {
  const channel = client.channels.cache.get(id);

  if(!channel || (guildId && channel.guild.id !== guildId)) return Promise.resolve(false);

  return channel.join().then(connection => {
    if(!guildsStates[channel.guild.id]) guildsStates[channel.guild.id] = {};
    guildsStates[channel.guild.id].connection = connection;
    return true;
  });
}

const playTrackInGuild = (track, guildId, onStart = () => {}, onFinish = () => {}) => {

  if(!guildsStates[guildId] || !guildsStates[guildId].connection) return false;

  const volume = guildsStates[guildId].volume || DEFAULT_VOLUME;

  const dispatcher = guildsStates[guildId].connection.play(track.filepath || track.url, {volume});
  
  dispatcher.track = track;
  dispatcher.guildId = guildId;

  dispatcher.on('start', onStart );
  
  dispatcher.on('finish', onFinish );
  dispatcher.on('finish', () => {
    guildsStates[guildId].status = "finished";
  } );

  dispatcher.on('error', console.error);

  if(!guildsStates[guildId]) guildsStates[guildId] = {};
  guildsStates[guildId].dispatcher = dispatcher;
  guildsStates[guildId].status = "playing";
  
} 

const resumeTrackInGuild = (guildId) => {
  if(!guildsStates[guildId] || !guildsStates[guildId].dispatcher) return false;

  guildsStates[guildId].dispatcher.resume();
  guildsStates[guildId].status = "playing";
  return guildsStates[guildId].dispatcher.streamTime/1000;
}

const pauseTrackInGuild = (guildId) => {
  if(!guildsStates[guildId] || !guildsStates[guildId].dispatcher) return false;

  guildsStates[guildId].dispatcher.pause();
  guildsStates[guildId].status = "paused";
  return guildsStates[guildId].dispatcher.streamTime/1000;
}

const getGuildState = (guildId) => {
  const guildState = guildsStates[guildId]
  if(!guildState) return false;
  return {
    track: guildState.dispatcher && guildState.dispatcher.track,
    state: {
      status: guildState.status,
      currentTime: guildState.dispatcher && guildState.dispatcher.streamTime/1000 
    }
  };
}

const getConnectedChannel = (guildId) => {
  const guildState = guildsStates[guildId]
  return guildState && guildState.connection && guildState.connection.channel.id;
}

const setBotVolume = (guildId, volume) => {
  if(!guildsStates[guildId]) guildsStates[guildId] = {};
  volume = volume/100;
  guildsStates[guildId].volume = volume;
  if(guildsStates[guildId].dispatcher){
    guildsStates[guildId].dispatcher.setVolume(volume);
  }
}

const getBotVolume = (guildId) => {
  if(!guildsStates[guildId]) return false;
  return guildsStates[guildId].volume * 100;
}

module.exports = {
  client,
  getAllGuildsFormatted,
  getVoiceChannelsFromGuild,
  joinVoiceChannelFromId,
  playTrackInGuild,
  resumeTrackInGuild,
  pauseTrackInGuild,
  getGuildState,
  getConnectedChannel,
  getBotVolume,
  setBotVolume
};