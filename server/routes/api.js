const express = require('express');

const adminController = require('../controllers/admin/');
const mainController = require('../controllers/main/');

const router = express.Router();

router.use('/admin', adminController);
router.use('/', mainController);

module.exports = router;