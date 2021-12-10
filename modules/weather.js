'use strict';

const axios = require('axios');

class Forcast {
    constructor(obj){
        this.description = `Low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description}`;
        this.date = obj.datetime;
    }
}

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

module.exports = handleGetWeather;
