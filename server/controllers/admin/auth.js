const express = require('express');
const router = express.Router();

const isAuthenticatedAdmin = require('../../middlewares/isAuthenticatedAdmin');

const Admin = require('../../models/Admin');

router.post('/login', (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  Admin.findFromUsername(username).then(admin => {
    if(!admin) return res.json({auth: false, message:"Invalid Credentials"});
    admin.authenticate(password).then(result => {
      if(!result) return res.json({auth: false, message:"Invalid Credentials"});

      return res
      .cookie('jwt-admin-token', admin.generateJwt(), {
          httpOnly: true, 
          maxAge: 6 * 3600 * 1000
        })
      .json({ auth: true });
    });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt-admin-token').json({ auth: false });
});

router.get('/check', isAuthenticatedAdmin, (req, res) => {
  res.json({ auth: true});
});

module.exports = router;