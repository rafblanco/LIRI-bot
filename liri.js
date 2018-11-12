// Node Packages
require("dotenv").config();
var request = require("request");
var fs = require("fs");

//Spotify keys
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Moment Package
var moment = require('moment');
moment().format();

// Commands
var input = process.argv;
var command = process.argv[2];

// Variables
var song = "";
var movieName = "";
var bandName = "";

var showData = [];
var divider = "\n------------------------------------------------------------\n\n";

function spotifySearch() {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        showData = [
            "Artist: " + data.tracks.items[0].album.artists[0].name,
            "Song name: " + song,
            "Link to song: " + data.tracks.items[0].album.external_urls.spotify,
            "Album: " + data.tracks.items[0].album.name
        ].join("\n\n")
        console.log(showData)
        logFile()
    });
}
function movieReq() {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=7d261316";
    request(queryUrl, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            showData = [
                "Movie Title: " + JSON.parse(body).Title,
                "Release Year: " + JSON.parse(body).Year,
                "IMDB Rating: " + JSON.parse(body).Ratings[0].Value,
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value,
                "Country: " + JSON.parse(body).Country,
                "Language: " + JSON.parse(body).Language,
                "Plot: " + JSON.parse(body).Plot,
                "Actors: " + JSON.parse(body).Actors
            ].join("\n\n");
            console.log(showData)
            logFile()
        }
    });
}
function concertReq() {

    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=trilogy";
    request(queryUrl, function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var venue = JSON.parse(body)[0].venue.name;
            var city = JSON.parse(body)[0].venue.city;
            var country = JSON.parse(body)[0].venue.country;
            var date = JSON.parse(body)[0].datatime;
            showData = [
                "Venue Name: " + venue,
                "Location: " + city + ", " + country,
                moment(date).format("MM/DD/YYYY")
            ].join("\n\n");
            console.log(showData)
            logFile();
        }
    });
}
function logFile() {
    fs.appendFile("log.txt", showData + divider, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Data logged....");
    });
}
switch (command) {
    case "spotify-this-song":
        for (var i = 3; i < input.length; i++) {
            if (i > 3 && i < input.length) {
                song = song + " " + input[i]
            }
            else {
                song += input[i];
            }
        }
        if (song === undefined) {
            song = "The Sign";
        }
        spotifySearch();

        break;

    // 'movie-this'
    case "movie-this":
        for (var i = 3; i < input.length; i++) {
            if (i > 3 && i < input.length) {
                movieName = movieName + "+" + input[i]
            }
            else {
                movieName += input[i];
            }
        }
        if (movieName === undefined) {
            movieName = "Mr.Nobody";
        }
        movieReq()

        break;

    // do-what-it-says
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            data = data.split(",");
            song = data[1];
            spotifySearch(song);
        });

        break;

    // concert-this
    case "concert-this":
    for (var i = 3; i < input.length; i++) {
        if (i > 3 && i < input.length) {
            bandName = bandName + "+" + input[i]
        }
        else {
            bandName += input[i];
        }
    }
        concertReq()

        break;
}