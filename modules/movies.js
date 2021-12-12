'use strict';

const axios = require('axios');
const cache = require('./cache');

class Movie {
    constructor(obj){
        this.title = obj.title;
        this.overview = obj.overview;
        this.average_votes = obj.vote_average;
        this.total_votes = obj.vote_count;
        this.image_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500/${obj.poster_path}` : `/images/catmovieposter.jpg`;
        this.popularity = obj.popularity;
        this.released_on = obj.release_date;
    }
}

async function handleGetMovies(request, response) {
    const loc = request.query.loc;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${loc}`;
    const key = `movies-${loc}`;

    if (cache[key] && (cache[key].timestamp > Date.now() - 3600000)){ //3600000 milliseconds in an hour
        console.log('cache hit - movies');
        response.status(200).send(cache[key].data);
    }else{
        console.log('cache miss - movies');
        cache[key] = {};
        cache[key].timestamp = Date.now();

        try{
            const result = await axios.get(url);
            const movieObjArr = result.data.results.map(movieObj => new Movie(movieObj));
            cache[key].data = movieObjArr;
            response.status(200).send(cache[key].data);
        } catch (error) {
            response.status(204).send({
                message: 'No movies about this location!'
            });
        }
    }
}

module.exports = handleGetMovies;
