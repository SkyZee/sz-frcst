using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Weather.Middleware.Helpers
{
    public static class CityRepository
    {
        private static readonly List<City> cities
            = new List<City> {
                new City
                {
                    Id = 2643744,
                    Name = "City of London",
                    Nickname = "london"
                },
                new City
                {
                    Id = 703448,
                    Name = "Kiev",
                    Nickname = "kyiv"
                },
                new City
                {
                    Id = 2673730,
                    Name = "Stockholm",
                    Nickname = "stockholm"
                }
            };
     

        public static int? GetCityId(string nickname)
        {
            var city = cities.FirstOrDefault(c => c.Nickname == nickname);
            return city?.Id ?? null;            
        }
    }
}
