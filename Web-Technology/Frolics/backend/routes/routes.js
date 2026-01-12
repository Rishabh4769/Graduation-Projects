const express = require('express');
const apiRouter = require('./routes/api');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'templates')));


app.get('/', (req, res) => {
  res.send('');
});