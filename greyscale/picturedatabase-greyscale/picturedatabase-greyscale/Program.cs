using System.Drawing;
using System.Drawing.Imaging;
using System.Text.Json;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Metadata;

namespace picturedatabase_greyscale
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddAuthorization();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Allow local CORS
            string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("*")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader();
                                  }));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseCors(MyAllowSpecificOrigins);

            app.MapPost("/createGreyscale", async (HttpRequest request) =>
            {
                // Use this to make it work with postman and other clients
                var body = new StreamReader(request.Body);
                string postData = await body.ReadToEndAsync();
                Dictionary<string, dynamic> keyValuePairs = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(postData) ?? new Dictionary<string, dynamic>();
                string id = keyValuePairs["id"].GetString();

                var folderPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData) + Path.DirectorySeparatorChar + "picturedb" + Path.DirectorySeparatorChar + id + Path.DirectorySeparatorChar;
                var mainPath = folderPath + "main.jpg";

                using (Image image = Image.Load(mainPath))
                {
                    image.Save(folderPath + "grayscale.jpg", new JpegEncoder()
                    {
                        ColorType = JpegEncodingColor.Luminance,
                    });
                }
            })
            .WithName("CreateGreyscale");

            app.Run();
        }
    }
}