const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongodb');

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB connected...');
    } catch (err) {
        console.log(err);
        //Exit process with error
        process.exit(1);
    }
};

module.exports = connectDB;