#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('thirdtier:server');
var http = require('http');
var WebSocket = require('ws');
var axios = require('axios');
var moment = require('moment');
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3001');
console.log(port);
app.set('port', port);

/**
 * Create HTTP server.
 */


var server = http.createServer(app);
var ws = new WebSocket.Server({ server })
/**
 * Listen on provided port, on all network interfaces.
 */

ws.on("connection", (ws) => {
  ws.on("message", (message) => {
    var obj = JSON.parse(message);
    if (obj.type === "forecast_requsted") {
      var appid = obj.appid;
      var lang = obj.lang;
      var cityid = obj.cityid;
      var units = obj.units;

      axios.all([
        getWeather(appid, lang, cityid, units),
        getForecast(appid, lang, cityid, units)
      ])
      .then(axios.spread(function (weather, forecast) {
        var forecastJson = aggregateResponses(weather, forecast)
        ws.send(JSON.stringify(forecastJson));
      
      })).catch((err) => {
          console.log(err);
      });
    }
  })
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function getWeather(appid, lang, cityId, units) {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${appid}&lang=${lang}&units=${units}`;
  return axios.get(weatherUrl);
}

function getForecast(appid, lang, cityId, units) {
  return axios.get(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${appid}&units=${units}&lang=${lang}`);
}

function groupByArray(xs, key) { 
  return xs.reduce(function (rv, x) { 
      var v = key instanceof Function ? key(x) : x[key]; 
      var el = rv.find((r) => r && r.key === v); 
      if (el) { el.values.push(x); 
  } 
  else { 
      rv.push({ key: v, values: [x] }); 
  } 
  return rv; 
  }, []); 
}

function aggregateResponses(respWeather, respForecast) {
  var jsonWeather = respWeather.data;
  var jsonForecast = respForecast.data;     
  var tList = jsonForecast.list.map(obj => {
      var tObj = {};
      var date = moment.unix(obj.dt);
      tObj.dt = obj.dt;  
      tObj.time = date.format("LT");
      tObj.dayInYear = date.dayOfYear(); 
      tObj.dayOfWeek = date.format("ddd");  
      tObj.temp = obj.main.temp;
      tObj.temp_min = obj.main.temp_min;
      tObj.temp_max = obj.main.temp_max;
      tObj.main = obj.weather[0].main;
      tObj.description =obj.weather[0].description;
      return tObj;
  });
  
  var days = [];
  for (var i=0; i < tList.length; i++) {
      var dayInYear = tList[i].dayInYear; 
      var result = days.find(obj => {
          return obj.dayInYear === dayInYear
        });
      if (!result) {
          days.push({dayInYear: dayInYear, dayOfWeek: tList[i].dayOfWeek, dt: tList[i].dt});
      }          
  }
  
  var transformedWeather = {
      city: jsonWeather.name,
      temp: jsonWeather.main.temp,
      country: jsonWeather.sys.country,
      dt: jsonWeather.dt,
      days: days,
      forecasts:  groupByArray(tList, "dayInYear")         
  }
  return transformedWeather;
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
