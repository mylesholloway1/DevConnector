const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;
const app = express();

connectDB();

app.get('/', (req,res)=>res.send('hello, the api is working.'))

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));