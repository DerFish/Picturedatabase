using SixLabors.ImageSharp.Formats.Jpeg;

namespace picturedatabase_thumbnail
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

            app.MapPost("/createThumbnail", (string id, int width) =>
            {
                var folderPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData) + Path.DirectorySeparatorChar + "picturedb" + Path.DirectorySeparatorChar + id + Path.DirectorySeparatorChar;
                var mainPath = folderPath + "main.jpg";

                using (var image = SixLabors.ImageSharp.Image.Load(mainPath))
                {
                    var height = (width * image.Height) / image.Width;

                    image.Mutate(ctx => ctx.Resize(width, height));
                    image.Save(folderPath + "thumbnail.jpg", new JpegEncoder());
                }
            })
            .WithName("CreateThumbnail");

            app.Run();
        }
    }
}