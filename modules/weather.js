'use strict';

const axios = require('axios');
const cache = require('./cache'); //needs the ./ but not the .js

class Forcast {
    constructor(obj){
        this.description = `Low of ${obj.low_temp}, high of ${obj.max_temp} with ${obj.weather.description}`;
        this.date = obj.datetime;
    }
}
//3600000 milliseconds in an hour
async function handleGetWeather(request, response) {
    const lat = request.query.lat;
    const lon = request.query.lon;
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=12`;
    const key = `weather-${lat}|${lon}`;

    //check if there is anything in the cache
    if (cache[key] && (cache[key].timestamp >= Date.now() - 3600000)){
        console.log('cache hit');
        response.status(200).send(cache[key].data);
    } else {
        console.log('cache.miss');
        cache[key] = {};
        cache[key].timestamp = Date.now();

        try{
            const result = await axios.get(url);
            const weatherObjArr = result.data.data.map(dataObj => new Forcast(dataObj));
            cache[key].data = weatherObjArr;
            response.status(200).send(cache[key].data);
        } catch (error) {
            response.status(204).send({
                message: 'No weather data found for location!'
            });
        }
    }
}

module.exports = handleGetWeather;
