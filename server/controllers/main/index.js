const express = require('express');

const DsBot = require('../../discord/bot');
const Auth = require('./auth');
const GuildModel = require('../../models/Guild');
const isAuthenticatedGuild = require('../../middlewares/isAuthenticatedGuild');

const router = express.Router();

router.use('/auth', Auth);

router.get('/guild/get', isAuthenticatedGuild, (req, res) => {  
  GuildModel.findFromId(req.guildId).then(guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});

    guild = Object.assign({}, guild);

    Object.keys(guild.tracks).forEach(key => {
      if(!guild.tracks[key].available) delete guild.tracks[key];
    });

    res.json(guild);
  });
});

router.get('/guild/get-vcs', isAuthenticatedGuild, (req, res) => {  
  const voiceChannels = DsBot.getVoiceChannelsFromGuild(req.guildId);
  if(!voiceChannels) return res.status(404);

  res.json(voiceChannels);
});

module.exports = router;