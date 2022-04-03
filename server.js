const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.get('/', (req,res)=>res.send('API has been created'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));