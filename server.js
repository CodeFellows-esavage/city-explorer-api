'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('server is listening on port', PORT));

//routes
app.get('/weather', handleGetWeather);

class Forcast {
    constructor(obj){
        this.description = obj.weather.description;
        this.date = obj.datetime;
    }
}

//forEach weather.data[{}] find .weather.description && .datetime

function handleGetWeather(request, response) {
    console.log(request.query.query);
    let locationObj = weather.find(obj => obj.city_name === request.query.query);
    if (locationObj) {
    //locationObj.data.foreach() clean up
        let locWeatherObjArr = locationObj.data.map(dataObj => new Forcast(dataObj));
        console.log(locWeatherObjArr);
        response.send(locWeatherObjArr);
    } else {
        //send some sort of error
        console.log('no locations found with that name');
        return response.status(204).send({
            message: 'no locations found with that name'
        });
    }

}


