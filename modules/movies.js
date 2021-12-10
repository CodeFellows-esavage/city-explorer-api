'use strict';

const axios = require('axios');

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

async function handleGetMovies(request, response) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${request.query.loc}`;

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

module.exports = handleGetMovies;
