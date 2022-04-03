const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongodb');

const connectDB = async()=>{
    try {
        mongoose.connect(db);
        console.log('MongoDB connected...');
    } catch (err) {
        console.log(err.message);
        //exit with failure
        process.exit(1);
    }
};

module.exports = connectDB;