// backend/controllers/movie-controller.js
const url = require('url');
const Movie = require('../models/movie');

module.exports = {
  getMovies: async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const page = parseInt(parsedUrl.query.page) || 1;
    const limit = parseInt(parsedUrl.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const movies = await Movie.find().skip(skip).limit(limit);
      const totalMovies = await Movie.countDocuments();

      const response = {
        movies,
        totalPages: Math.ceil(totalMovies / limit),
        currentPage: page
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (err) {
      console.error('Error fetching movies:', err);

      const errorResponse = {
        error: 'Internal Server Error',
        details: err.message
      };

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(errorResponse));
    }
  },

  getMovie: async (req, res, id) => {
    try {
      const movie = await Movie.findById(id);
      if (movie) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Movie not found');
      }
    } catch (err) {
      console.error('Error fetching movie:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  },

  createMovie: async (req, res) => {
    try {
      const newMovie = new Movie(req.body);
      await newMovie.save();
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newMovie));
    } catch (err) {
      console.error('Error creating movie:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  },

  updateMovie: async (req, res, id) => {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedMovie) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedMovie));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Movie not found');
      }
    } catch (err) {
      console.error('Error updating movie:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  },

  deleteMovie: async (req, res, id) => {
    try {
      const deletedMovie = await Movie.findByIdAndDelete(id);
      if (deletedMovie) {
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Movie not found');
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
};
