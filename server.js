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

class Forcast {
    constructor(obj){
        this.description = `Low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description}`;
        this.date = obj.datetime;
    }
}

//forEach weather.data[{}] find .weather.description && .datetime

async function handleGetWeather(request, response) {
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${request.query.lat}&lon=${request.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=12`;
    console.log(request.query);
    console.log(url);
    try{
        let result = await axios.get(url);
        console.log(result.data.data);
        let weatherObjArr = result.data.data.map(dataObj => new Forcast(dataObj));
        console.log(weatherObjArr);
        response.send(weatherObjArr);
    } catch (error){
        console.log('No weather data found for location!');
        response.status(204).send({
            message: 'No weather data found for location!'
        });
    }
}



