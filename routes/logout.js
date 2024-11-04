const express =require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const verifyJWT = require('../config/verifyJWT');

router.route('/')
    .get(verifyJWT, logoutController.handleLogout);
module.exports = router;