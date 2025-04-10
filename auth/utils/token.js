function generateToken(user) {
    const json = JSON.stringify(user);
    return Buffer.from(json).toString('base64');
  }
  
  function verifyToken(token) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  }
  
  module.exports = { generateToken, verifyToken };
  