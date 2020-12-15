const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quantitySchema = new Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   quantity: {
      type: Number,
      required: true,
      trim: true
   },
   _itemID: {
      type: mongoose.Types.ObjectId,
      required: true
   }
});

const timeSchema = new Schema({
   hours: {
      type: Number,
      required: true,
   },
   minutes: {
      type: Number,
      required: true,
   }
});

const sessionSchema = new Schema({
   title: {
      type: String,
      required: true,
      trim: true
   },

   _activityID: {
      type: mongoose.Types.ObjectId,
      required: true
  },

   items: [quantitySchema],

   time: timeSchema
})


const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session }