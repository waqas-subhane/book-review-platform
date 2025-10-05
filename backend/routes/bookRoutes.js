const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController.js');
const { createReview } = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/').get(getBooks).post(protect, createBook);
router.route('/:id').get(getBookById).put(protect, updateBook).delete(protect, deleteBook);
router.route('/:id/reviews').post(protect, createReview);

module.exports = router;