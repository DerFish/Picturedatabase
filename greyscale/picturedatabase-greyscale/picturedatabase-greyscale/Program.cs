using System.Drawing;
using System.Drawing.Imaging;
using SixLabors.ImageSharp.Formats.Jpeg;

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

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapPost("/createGreyscale", (string id) =>
            {
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