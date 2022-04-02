const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3001;
const app = express();

//connect to database
connectDB();

//init middleware
app.use(express.json({extended:false}));

app.get('/', (req,res)=>res.send('API is listening'))

//define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`));

