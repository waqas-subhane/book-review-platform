import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FaPlus } from 'react-icons/fa'; // Icon import

const Home = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/books?page=${page}`);
        setBooks(data.books);
        setPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [page]);

  return (
    <div className="container p-4 mx-auto my-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-slate-800">All Books</h1>
        <Link to="/add-book" className="flex items-center space-x-2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-slate-900 transition-colors font-semibold">
          <FaPlus />
          <span>Add New Book</span>
        </Link>
      </div>
      
      {loading ? (
        <p className="text-center text-slate-500">Loading books...</p>
      ) : books.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-700">No books found.</h2>
            <p className="text-slate-500 mt-2">Why not be the first to add one?</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 truncate">{book.title}</h2>
                  <p className="mt-2 text-md text-slate-600">by {book.author}</p>
                  <p className="mt-2 text-sm text-slate-400 bg-slate-100 inline-block px-2 py-1 rounded">{book.genre}</p>
                </div>
                <Link to={`/books/${book._id}`} className="block bg-slate-50 text-center text-slate-700 font-semibold p-4 hover:bg-slate-100 transition-colors">
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center mt-12 space-x-4">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-5 py-2 font-bold text-slate-700 bg-white rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <span className="font-semibold text-slate-600">Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, pages))} disabled={page === pages} className="px-5 py-2 font-bold text-slate-700 bg-white rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;