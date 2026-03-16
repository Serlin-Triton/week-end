# =========================
# Dockerfile for ZoomTrip.API
# =========================

# 1️⃣ Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ZoomTrip.API.csproj ./
RUN dotnet restore

# Copy the rest of the project files
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# 2️⃣ Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Run the app
ENTRYPOINT ["dotnet", "ZoomTrip.API.dll"]