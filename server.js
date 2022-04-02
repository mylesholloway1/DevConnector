const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.get('/', (req,res)=>res.send('API has been created'));

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));