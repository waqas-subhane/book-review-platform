const Review = require('../models/Review.js');
const Book = require('../models/Book.js');

// @desc    Create a review
// @route   POST /api/books/:id/reviews
// @access  Private
const createReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    const alreadyReviewed = await Review.findOne({
      bookId: req.params.id,
      userId: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Book already reviewed' });
    }

    const review = new Review({
      bookId: req.params.id,
      userId: req.user._id,
      user: { name: req.user.name },
      rating,
      reviewText,
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.id);
    if(review) {
        if(review.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized'});
        }
        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } else {
        res.status(404).json({ message: 'Review not found' });
    }
};

module.exports = { createReview, deleteReview };