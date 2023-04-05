using ExifLibrary;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using static System.Environment;

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

        var b = img.Properties.Get<ExifAscii>(ExifTag.CameraOwnerName);
        foreach (var property in img.Properties)
        {
            Console.WriteLine(property.Name);
        }
        var path = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData)+ Path.DirectorySeparatorChar + "picturedb" + Path.DirectorySeparatorChar + file.Name + ".jpg";
        Console.WriteLine($"{path}");
        img.Save(path);
    }
})
    .WithName("UploadFiles");

app.Run();
