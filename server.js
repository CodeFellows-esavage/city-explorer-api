'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const handleGetWeather = require('./modules/weather');
const handleGetMovies = require('./modules/movies');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('server is listening on port', PORT));

//routes
app.get('/weather', handleGetWeather);
app.get('/movie', handleGetMovies);
