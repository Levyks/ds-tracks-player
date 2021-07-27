const express = require('express');
const router = express.Router();

const isAuthenticatedGuild = require('../../middlewares/isAuthenticatedGuild');

const DsBot = require('../../discord/bot');

const Guild = require('../../models/Guild');

router.get('/get-guilds', (req, res) => {
  const guilds = DsBot.getAllGuildsFormatted();

  res.json(guilds);
});

router.post('/login', (req, res) => {
  const guildId = req.body.guildId;
  const password = req.body.password;
  Guild.findFromId(guildId).then(guild => {
    if(!guild) return res.status(404).json({auth: false, message:"Guild not found."});
    guild.authenticate(password).then(result => {
      if(!result) return res.json({auth: false, message:"Wrong password"});

      return res
      .cookie('jwt-guild-token', guild.generateJwt(), {
          httpOnly: true, 
          maxAge: 3600 * 1000
        })
      .json({ auth: true });
    });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt-guild-token').json({ auth: false });
});

router.get('/check', isAuthenticatedGuild, (req, res) => {
  res.json({ auth: true});
});

module.exports = router;