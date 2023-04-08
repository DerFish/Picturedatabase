using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();


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
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors(MyAllowSpecificOrigins);



//app.UseHttpsRedirection();
app.UseStaticFiles()
    .UseStaticFiles(new StaticFileOptions()
    {
        FileProvider = new PhysicalFileProvider(Environment.GetEnvironmentVariable("REACT_APP_IMAGEFOLDERPATH")),
        RequestPath = new PathString(Environment.GetEnvironmentVariable("REACT_APP_IMAGEFOLDERPATH"))
    });
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
