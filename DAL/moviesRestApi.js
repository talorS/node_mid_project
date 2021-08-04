const axios = require('axios');

exports.getMovies = function()
{
    return axios.get("https://api.tvmaze.com/shows");
}

exports.getMovie = function(id)
{
    return axios.get("https://api.tvmaze.com/shows/" + id);
}