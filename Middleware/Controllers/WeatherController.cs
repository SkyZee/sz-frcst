using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Weather.Middleware.Helpers;

namespace Weather.Middleware
{
    [Produces("application/json")]
    [Route("api/weather")]
    public class WeatherController : Controller
    {
        public IConfiguration configuration;
        public WeatherController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
            
        [HttpGet("{city}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> GetWeather(string city, [FromQuery] string units = "metric", [FromQuery] string lang = "en")
        {
            var cityId = CityRepository.GetCityId(city);
            if (cityId == null)
            {
                return NotFound(new { error = "We don't have a forecast for this city" });
            }
           
            var appId = configuration["appid"];
            //var client = new middleware.ForecastWebSocketClient(new Uri("ws://localhost:3001"));
            var client = new middleware.ForecastWebSocketClient(new Uri("ws://sz-node.azurewebsites.net/"));
            var forecast = await client.GetForecast(appId, cityId, units, lang);
            var forecastJson = JsonConvert.DeserializeObject(forecast);
            return Ok(forecastJson);
        }
    }
}
