const express = require('express');
const bodyParser = require('body-parser');
const filterRoute = require('./routes/filter');

const app = express();
app.use(bodyParser.json());

app.use('/filter', filterRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
