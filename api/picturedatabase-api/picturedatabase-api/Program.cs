using ExifLibrary;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

var builder = WebApplication.CreateBuilder(args);

string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("https://localhost:44420")
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

app.UseCors(MyAllowSpecificOrigins);
app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateTime.Now.AddDays(index),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapPut("/uploadpictures", async (HttpRequest fileReq) =>
{
    var file = fileReq.Form.Files[0];
    if (file == null || file.Length == 0)
    {
        return;
    }

    using (var memoryStream = new MemoryStream())
    {
        await file.CopyToAsync(memoryStream);
        var img = ImageFile.FromStream(memoryStream);

        var p = img.Properties.Get<PNGTimeStamp>(ExifTag.PNGTimeStamp);
    }
})
    .WithName("UploadFiles");

app.Run();

internal record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}