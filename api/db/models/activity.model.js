const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }
});

const activitySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    items: [itemSchema]
})

const Activity = mongoose.model('Activity', activitySchema);

module.exports = { Activity }