const express = require('express');
const { userInfo } = require('os');
const app = express();
const port = 3000;
// Optional 404 handler for all other routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/home`);
});