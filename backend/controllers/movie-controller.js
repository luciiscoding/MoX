// backend/controllers/movie-controller.js
const Movie = require('../models/movie');

module.exports = {
  getMovies: async (req, res) => {
    try {
      const movies = await Movie.find();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(movies));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
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
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
};
