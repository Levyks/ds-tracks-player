const express = require('express');

const router = express.Router();

const Guild = require('../../models/Guild');

const DsBot = require('../../discord/bot');

const trackFetcher = require('../../helpers/trackFetcher');

router.get('/get', (req, res) => {
  const guilds = DsBot.getAllGuildsFormatted();

  res.json(guilds);
});

router.get('/get/:id', (req, res) => {
  Guild.findFromId(req.params.id).then(guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});
    res.json(guild);
  });
});

router.post('/:guildId/set-password', (req, res) => {
  if(!req.body.password) return res.status(400).json({message: "No password provided"});
  Guild.findFromId(req.params.guildId).then(guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});

    guild.setPassword(req.body.password).then(() => {
      guild.save().then(() => {
        res.sendStatus(201);
      });
    });
    
  });
});

router.post('/:guildId/add-track', (req, res) => {
  Guild.findFromId(req.params.guildId).then(async guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});

    const tracksKeys = Object.keys(guild.tracks);
    const id = (parseInt(tracksKeys[tracksKeys.length-1]) + 1).toString();

    const {duration, filepath} = await trackFetcher.fetchTrackDuration(req.body.url, guild.id, id);
    req.body.duration = duration;

    if(process.env.CACHE_TRACKS == 'true') {
      req.body.filepath = filepath;
    }

    if(!req.body.duration) return res.status(400).json({message: "Invalid track url"});

    guild.tracks[id] = req.body;
    guild.tracks[id].id = id;
    
    guild.save().then(() => {
      res.status(201).json({id});
    });
  });
});

router.put('/:guildId/update-track/:trackId', (req, res) => {
  if(req.body.id != req.params.trackId) return res.status(400).json({message: "ID's from body and query url don't match"});

  Guild.findFromId(req.params.guildId).then(async guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});
    if(!guild.tracks[req.params.trackId]) return res.status(404).json({message: "Track not found"});
    
    if(guild.tracks[req.params.trackId].url !== req.body.url || !guild.tracks[req.params.trackId].duration) {
      const {duration, filepath} = await trackFetcher.fetchTrackDuration(req.body.url, guild.id, req.params.trackId);
      req.body.duration = duration;

      if(process.env.CACHE_TRACKS == 'true') {
        req.body.filepath = filepath;
      }

      if(!req.body.duration) return res.status(400).json({message: "Invalid track url"});
    }

    guild.tracks[req.params.trackId] = req.body;
    
    guild.save().then(() => {
      res.sendStatus(204);
    });
  });
});

router.delete('/:guildId/delete-track/:trackId', (req, res) => {
  Guild.findFromId(req.params.guildId).then(guild => {
    if(!guild) return res.status(404).json({message: "Guild not found"});
    if(!guild.tracks[req.params.trackId]) return res.status(404).json({message: "Track not found"});

    delete guild.tracks[req.params.trackId];
    
    guild.save().then(() => {
      res.sendStatus(204);
    });
  });
});

module.exports = router;