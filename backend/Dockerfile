FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj first and restore
COPY ZoomTrip/*.csproj ./
RUN dotnet restore

# Copy everything else and publish
COPY ZoomTrip/. ./
RUN dotnet publish -c Release -o /app/publish

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "ZoomTrip.dll"]