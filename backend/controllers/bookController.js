const Book = require('../models/Book.js');
const Review = require('../models/Review.js');

// @desc    Fetch all books with pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.page) || 1;
  const count = await Book.countDocuments();
  const books = await Book.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ books, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    const reviews = await Review.find({ bookId: book._id });
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    res.json({ ...book.toObject(), reviews, avgRating });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  const book = new Book({
    title,
    author,
    description,
    genre,
    year,
    addedBy: req.user._id,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    book.title = title;
    book.author = author;
    book.description = description;
    book.genre = genre;
    book.year = year;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await book.deleteOne();
    await Review.deleteMany({ bookId: req.params.id }); // Also delete reviews
    res.json({ message: 'Book removed' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };