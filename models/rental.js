const Joi = require("@hapi/joi");
const moment = require("moment");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true },
      isGold: { type: Boolean, required: true },
      phone: { type: String, required: true }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: { type: String, required: true, trim: true },
      dailyRentalRate: { type: Number, required: true }
    }),
    required: true
  },
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturned: Date,
  rentalFee: Number
});

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId
  });
};

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

module.exports = { Rental, validateRental };
