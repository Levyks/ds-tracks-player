const express = require('express');

const Auth = require('./auth');
const Guild = require('./guild');

const isAuthenticatedAdmin = require('../../middlewares/isAuthenticatedAdmin');

const router = express.Router();

router.use('/auth', Auth);

router.use('/guild', isAuthenticatedAdmin, Guild);

module.exports = router;