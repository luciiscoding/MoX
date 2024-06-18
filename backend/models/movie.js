// backend/models/movie.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Movie Schema
const MovieSchema = new Schema({
  show_id: String,
  type: String,
  title: String,
  director: String,
  cast: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String
});

// Create Movie Model
const Movie = mongoose.model('Movie', MovieSchema, 'Movies');

module.exports = Movie;