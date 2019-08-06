'use strict';

require('dotenv').config();

// dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// APIs Routes
app.get('/location', searchToLatLong);
app.get('/weather', getWeather);
app.get('/events', getEvents);


app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function Location(query, location) {
  this.search_query = query;
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toString().slice(0, 15);
  this.summary = event.summary;
}

// go out to Google API
function searchToLatLong(request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(result => {
      response.send(new Location(request.query.data, result.body.results[0]));
    })
    .catch(error => handleError(error, response));
}

// go out to dark sky api
function getWeather(request, response) {
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  return superagent.get(url)
    .then(weather => {
      const weatherResults = weather.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.send(weatherResults);
    })
    .catch(error => handleError(error, response));
}

// go out to eventbrite api
function getEvents(request, response) {
  const url = `https://www.eventbriteapi.com/v3/events/search?token=${process.env.EVENTBRITE_API_KEY}&location.address=${request.query.data.formatted_query}`;

  superagent.get(url)
    .then(result => {
      const events = result.body.events.map(eventData => {
        const event = new Event(eventData);
        return event;
      });

      response.send(events);
    })
    .catch(error => handleError(error, response));
}

// handle errors
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}
