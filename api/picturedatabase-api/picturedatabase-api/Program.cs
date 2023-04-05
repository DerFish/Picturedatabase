using ExifLibrary;
using Microsoft.AspNetCore.Mvc;
using picturedatabase_api.Config;
using picturedatabase_api.Db;
using System.Drawing;
using static System.Environment;

var builder = WebApplication.CreateBuilder(args);

// Allow local CORS
string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("*")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      }));
builder.Services.Configure<PictureDatabaseSettings>(
    builder.Configuration.GetSection("PictureDatabase"));

builder.Services.AddSingleton<PictureService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseHttpsRedirection();

app.MapGet("/getPictureInfo", async (string id, PictureService service) =>
{
    var item = await service.GetAsync(id);
    return item;
});

app.MapPut("/uploadPicture", async (HttpRequest fileReq, PictureService service) =>
{
    // Only upload of the file
    // Creation of the folder on the disk
    // Creation of the db entry with all exif properties
    // Return GUID for edit afterwards

    var file = fileReq.Form.Files[0];
    if (file == null || file.Length == 0)
    {
        return Results.BadRequest("No file");
    }

    using (var memoryStream = new MemoryStream())
    {
        await file.CopyToAsync(memoryStream);
        var img = ImageFile.FromStream(memoryStream);

        var dbEntry = new Picture(Guid.NewGuid().ToString(), file.FileName, Path.GetExtension(file.FileName).TrimStart('.'), file.Length);
        dbEntry.CreateDate = DateTime.Now;

        foreach (var property in img.Properties)
        {
            dbEntry.ExifProperties.Add(new picturedatabase_api.Db.ExifProperty(property.Name, property.Value?.ToString() ?? ""));
        }

        await service.CreateAsync(dbEntry);

        var folderPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData) + Path.DirectorySeparatorChar + "picturedb" + Path.DirectorySeparatorChar + dbEntry.Id;
        Directory.CreateDirectory(folderPath);
        await img.SaveAsync(folderPath + Path.DirectorySeparatorChar + "main." + dbEntry.FileType);

        return Results.Json(dbEntry.Id);
    }
})
    .WithName("UploadFiles");

app.Run();
