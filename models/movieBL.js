const e = require('express');
const dalRead = require('../DAL/fileReader');
const dalWrite = require('../DAL/fileWriter');
const movieRest = require('../DAL/moviesRestApi');

exports.insetMovie = async function (obj) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/NewMovies.json')
        .catch(error => { return error; });
    let movies = resp.movies;
    let maxID = 0;
    if (movies.length == 0) {
        resp = await movieRest.getMovies().catch(error => { return error; });
        maxID = Math.max(...resp.data.map(x => x.id));
    } else {
        maxID = Math.max(...movies.map(x => x.id));
    }
    //Data Shaping
    let data = {
        id: maxID + 1,
        name: obj.name,
        language: obj.lang,
        genres: obj.genres.split(",")
    }

    movies.push(data);
    await dalWrite.writeDataToFile('../node_mid_project/jsonData/NewMovies.json', { movies })
        .catch(error => { return error; });

    return '';
}

exports.getMoviesData = async function () {
    let arr1 = [];
    let arr2 = [];
    let respRest = await movieRest.getMovies();
    let respFile = await dalRead.readDataFromFile('../node_mid_project/jsonData/NewMovies.json');
    const languages = [...new Set([...respRest.data.map(x => x.language), ...respFile.movies.map(x => x.language)])];

    respRest.data.forEach(movie => {
        movie.genres.forEach(genre => {
            arr1.push(genre);
        })
    });

    respFile.movies.forEach(movie => {
        movie.genres.forEach(genre => {
            arr2.push(genre);
        })
    });

    const genres = [...new Set([...arr1, ...arr2])];

    return { languages, genres };
}

exports.searchMovies = async function (obj) {
    const respRest = await movieRest.getMovies();
    const respFile = await dalRead.readDataFromFile('../node_mid_project/jsonData/NewMovies.json');
    let merged = [...respFile.movies, ...respRest.data];
    let filtered = merged.filter(movie =>
        (obj.name ? movie.name.indexOf(obj.name) > -1 : true) &&
        (obj.language ? obj.language === movie.language : true) &&
        (obj.genre ? movie.genres.includes(obj.genre) : true)
    );

    filtered.forEach(x => {
        let list = [];
        merged.forEach(j => {
            if (x.name !== j.name && x.genres.some(c => j.genres.includes(c)))
                list.push({ id: j.id, name: j.name });
        });
        list = list.slice(0, 10);
        x.list = list;
    });

    const keys_to_keep = ['name', 'id', 'list'];
    filtered = filtered.map(o => keys_to_keep.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
    }, {}));

    return filtered;
}

exports.getMovie = async function (id) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/NewMovies.json');
    const movie = resp.movies.find(x => x.id == id);
    if (movie === undefined) {
        resp = await movieRest.getMovie(id);
        return resp.data;
    }
    return movie;
}