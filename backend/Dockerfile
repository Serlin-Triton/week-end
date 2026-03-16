FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. First, copy EVERYTHING to the /src folder in Docker
COPY . .

# 2. Try to restore. This will find your .csproj automatically.
RUN dotnet restore

# 3. Publish the app
RUN dotnet publish -c Release -o /app/publish

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# IMPORTANT: Make sure your file is ZoomTrip.dll (check case sensitivity)
ENTRYPOINT ["dotnet", "ZoomTrip.dll"]