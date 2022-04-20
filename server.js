const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');

const PORT = process.env.PORT || 3001;
const app = express();

//connect to MongoDB
connectDB();

//init middleware
app.use(express.json({ extended: false }));
app.use(passport.initialize());

require('./middleware/passport');

//define routes
app.use('/', require('./routes/root/user'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/posts'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
