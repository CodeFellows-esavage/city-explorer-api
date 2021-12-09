'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('server is listening on port', PORT));

//routes
app.get('/weather', handleGetWeather);
app.get('/movie', handleGetMovie);

class Forcast {
    constructor(obj){
        this.description = `Low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description}`;
        this.date = obj.datetime;
    }
}

class Movie {
    constructor(obj){
        this.title = obj.title;
        this.overview = obj.overview;
        this.average_votes = obj.vote_average;
        this.total_votes = obj.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500/${obj.poster_path}`;
        this.popularity = obj.popularity;
        this.released_on = obj.release_date;
    }
}

//forEach weather.data[{}] find .weather.description && .datetime

async function handleGetWeather(request, response) {
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.lat}&lon=${request.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=12`;

    try{
        const result = await axios.get(url);
        const weatherObjArr = result.data.data.map(dataObj => new Forcast(dataObj));
        response.send(weatherObjArr);
    } catch (error) {
        response.status(204).send({
            message: 'No weather data found for location!'
        });
    }
}

async function handleGetMovie(request, response) {
    //Jack+Reacher format for multiple strings
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.loc}`;
    console.log(request.query.loc);
    console.log(url);
    try{
        const result = await axios.get(url);
        const movieObjArr = result.data.results.map(movieObj => new Movie(movieObj));
        response.send(movieObjArr);
    } catch (error) {
        response.status(204).send({
            message: 'No movies about this location!'
        });
    }
}



