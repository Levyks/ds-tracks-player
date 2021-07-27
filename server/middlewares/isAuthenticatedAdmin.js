const jwt = require('jsonwebtoken');

function isAuthenticatedAdmin(req, res, next){
  const token = req.cookies['jwt-admin-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    
    req.adminId = decoded.id;
    next();
  });
}

module.exports = isAuthenticatedAdmin;