#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["picturedatabase-thumbnail/picturedatabase-thumbnail.csproj", "picturedatabase-thumbnail/"]
RUN dotnet restore "picturedatabase-thumbnail/picturedatabase-thumbnail.csproj"
COPY . .
WORKDIR "/src/picturedatabase-thumbnail"
RUN dotnet build "picturedatabase-thumbnail.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "picturedatabase-thumbnail.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "picturedatabase-thumbnail.dll"]