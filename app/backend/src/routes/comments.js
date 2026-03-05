const express = require('express');
const router = express.Router();

// Placeholder routes for comments
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Comments routes - To be implemented',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create comment - To be implemented',
    data: null
  });
});

module.exports = router;