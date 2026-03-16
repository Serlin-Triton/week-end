# =========================
# Dockerfile for ZoomTrip.API
# =========================

# 1️⃣ Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ZoomTrip.API.csproj ./
RUN dotnet restore

# Copy the rest of the project files and publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# 2️⃣ Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Run the app
ENTRYPOINT ["dotnet", "ZoomTrip.API.dll"]