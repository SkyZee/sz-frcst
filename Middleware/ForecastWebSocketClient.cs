using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace middleware
{
    public class ForecastWebSocketClient
    {
        private ClientWebSocket client;

        public Uri forecastServerUri { get; set; }

        public ForecastWebSocketClient(Uri serverUri)
        {
            client = new ClientWebSocket();
            forecastServerUri = serverUri;
        }

        public async Task<string> GetForecast(string appId, int? cityId, string units, string lang)
        {
            var eventMessage = new EventMessage
            {
                ts = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                type = "forecast_requsted",
                lang = lang,
                units = units,
                cityid = cityId,
                appid = appId
            };
            var message = JsonConvert.SerializeObject(eventMessage);

            await client.ConnectAsync(forecastServerUri, CancellationToken.None);
            await SendRequest(message);
            var weather = await Receive();
            return weather;
        }

        private async Task<string> Receive()
        {
            var receiveBufferSize = 1024; // TODO: why?
            //byte[] buffer = new byte[receiveBufferSize];
            ArraySegment<Byte> buffer = new ArraySegment<byte>(new Byte[receiveBufferSize]);
            WebSocketReceiveResult result = null;

            using (var ms = new MemoryStream())
            {
                do
                {
                    result = await client.ReceiveAsync(buffer, CancellationToken.None);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while (!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);

                using (var reader = new StreamReader(ms, Encoding.UTF8))
                {
                    var stream = reader.ReadToEnd();
                    //var resultJson = (new UTF8Encoding()).GetString(stream);
                    return stream;
                }                    
            }
        }

        private async Task SendRequest(string jsonMsg)
        {
            ArraySegment<byte> buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(jsonMsg));
            await client.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        }


    }


    class EventMessage
    {
        public string ts { get; set; }
        public string type { get; set; }
        public string lang { get; set; }
        public string units { get; set; }
        public int? cityid { get; set; }
        public string appid { get; set; }
    }
}
