using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using picturedatabase_api.Config;

namespace picturedatabase_api.Util
{
    public class RequestSender
    {
        public readonly IOptions<PictureServicesSettings> settings;
        private readonly IHttpClientFactory _httpClientFactory;

        public RequestSender(IHttpClientFactory httpClientFactory, IOptions<PictureServicesSettings> settings)
        {
            _httpClientFactory = httpClientFactory;
            this.settings = settings;
        }

        public async Task CreateGreyscale(string id)
        {
            using StringContent jsonContent = new(
        JsonSerializer.Serialize(new
        {
            id = id,
        }),
        Encoding.UTF8,
        "application/json");

            var httpRequestMessage = new HttpRequestMessage(
                       HttpMethod.Post,
                       settings.Value.GreyscaleServiceAddress + "createGreyscale")
            {
                Content = jsonContent
            };

            var httpClient = _httpClientFactory.CreateClient();
            var httpResponseMessage = await httpClient.SendAsync(httpRequestMessage);

            Console.WriteLine(httpResponseMessage.StatusCode);
        }

        public async Task CreateThumbnail(string id, int width)
        {
            using StringContent jsonContent = new(
       JsonSerializer.Serialize(new
       {
           id = id,
           width = width,
       }),
       Encoding.UTF8,
       "application/json");

            var httpRequestMessage = new HttpRequestMessage(
                       HttpMethod.Post,
                       settings.Value.ThumbnailServiceAddress + "createThumbnail")
            {
                Content = jsonContent
            };

            var httpClient = _httpClientFactory.CreateClient();
            var httpResponseMessage = await httpClient.SendAsync(httpRequestMessage);

            Console.WriteLine(httpResponseMessage.StatusCode);
        }
    }
}
