const Discord = require('discord.js');

const Guild = require('../models/Guild');

const client = new Discord.Client();
client.login(process.env.DS_BOT_TOKEN);

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

const connections = {};
const dispatchers = {};

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

const joinVoiceChannelFromId = (id, guildId = false) => {
  const channel = client.channels.cache.get(id);

  if(!channel || (guildId && channel.guild.id !== guildId)) return false;

  channel.join().then(connection => {
    connections[channel.guild.id] = connection;
  });
}

const playTrackInGuild = (track, guildId, onStart = () => {}, onFinish = () => {}) => {

  if(!connections[guildId]) return false;

  const dispatcher = connections[guildId].play(track.url);
  
  dispatcher.track = track;
  dispatcher.guildId = guildId;

  dispatcher.on('start', onStart );
  
  dispatcher.on('finish', onFinish );
  

  dispatcher.on('error', console.error);

  dispatchers[guildId] = dispatcher;
  
} 

module.exports = {
  client,
  getAllGuildsFormatted,
  getVoiceChannelsFromGuild,
  joinVoiceChannelFromId,
  playTrackInGuild
};