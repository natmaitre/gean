const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'))

app.use('/discord', require('./discord'));

app.get('/game', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'game/index.html'));
});

app.get('/', (req, res) => {
	res.redirect("/discord/login");
});

app.listen(80, () => {
});
