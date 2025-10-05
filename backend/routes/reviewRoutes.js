const express = require('express');
const { deleteReview } = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/:id').delete(protect, deleteReview);

module.exports = router;