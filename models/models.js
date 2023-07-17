const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  data: Object,
});

const directionSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  routeId: Number,
  data: Object,
});

const Route = mongoose.model('Route', routeSchema);
const Direction = mongoose.model('Direction', directionSchema);

module.exports = {
  Route,
  Direction,
};