const express = require('express');
const router = express.Router();

// Rota para obter o código de autorização
router.get('/authorization-code', (req, res) => {
  const authorizationCode = process.env.AUTHORIZATION_CODE;
  res.json({ authorizationCode });
});

module.exports = router;
