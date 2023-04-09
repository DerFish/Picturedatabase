using Amazon.Runtime.Internal;
using ExifLibrary;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using picturedatabase_api.Config;
using picturedatabase_api.Db;
using picturedatabase_api.Util;
using System.Drawing;
using System.Text.Json;
using static System.Environment;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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
builder.Services.Configure<PictureDatabaseSettings>(
    builder.Configuration.GetSection("PictureDatabase"));

builder.Services.Configure<PictureServicesSettings>(
    builder.Configuration.GetSection("PictureServices"));

builder.Services.AddSingleton<PictureService>();
builder.Services.AddSingleton<RequestSender>();

builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
//app.UseHttpsRedirection();

app.MapGet("/getPictureInfo", async (string id, PictureService service) =>
{
    return await service.GetAsync(id);
});

app.MapGet("/getPictures", async (PictureService service) =>
{
    return await service.GetAsync();
});

app.MapGet("/getTags", (PictureService service) =>
{
    return service.GetTags();
});

app.MapPost("/filterPicturesByTags",async (HttpRequest request, PictureService service) =>
{
    var body = new StreamReader(request.Body);
    string postData = await body.ReadToEndAsync();

    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    var tags = JsonSerializer.Deserialize<List<string>>(postData, options);

    if(tags.Count == 0)
    {
        return await service.GetAsync();
    }

    return  service.GetByTagsAsync(tags);
})
    .WithName("Filter pictures by tags");

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

        var dbEntry = new Picture(
            Guid.NewGuid().ToString(),
            file.FileName,
            Path.GetExtension(file.FileName).TrimStart('.'),
            file.Length.ToString()
            );
        dbEntry.CreateDate = DateTime.Now.ToString();

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

app.MapPost("/editPicture", async (HttpRequest request, PictureService service) =>
{
    var body = new StreamReader(request.Body);
    string postData = await body.ReadToEndAsync();

    var options = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    var pic = JsonSerializer.Deserialize<Picture>(postData, options);
    await service.UpdateAsync(pic.Id, pic);
}).WithName("EditPicture");

app.MapPost("/createGreyscale", async (HttpRequest request, RequestSender requestSender) =>
{
    var body = new StreamReader(request.Body);
    string postData = await body.ReadToEndAsync();
    Dictionary<string, dynamic> keyValuePairs = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(postData) ?? new Dictionary<string, dynamic>();
    string id = keyValuePairs["id"].GetString();

    await requestSender.CreateGreyscale(id);
}).WithName("Create Greyscale");

app.MapPost("/createThumbnail", async (HttpRequest request, RequestSender requestSender) =>
{
    var body = new StreamReader(request.Body);
    string postData = await body.ReadToEndAsync();
    Dictionary<string, dynamic> keyValuePairs = JsonSerializer.Deserialize<Dictionary<string, dynamic>>(postData) ?? new Dictionary<string, dynamic>();
    string id = keyValuePairs["id"].GetString();
    int width = requestSender.settings.Value.ThumbnailWidth ?? 150;

    await requestSender.CreateThumbnail(id, width);
}).WithName("Create Thumbnail");

app.Run();
