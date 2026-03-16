# 1️⃣ Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Render-ல் Root Directory 'backend' என மாற்றியிருந்தால் 
# ZoomTrip.API ஃபோல்டருக்குள் இருக்கும் .csproj கோப்பை காப்பி செய்ய வேண்டும்
COPY ZoomTrip.API/ZoomTrip.API.csproj ./ZoomTrip.API/
RUN dotnet restore "ZoomTrip.API/ZoomTrip.API.csproj"

# எல்லா கோப்புகளையும் காப்பி செய்து, பின் அந்த ஃபோல்டருக்குள் சென்று Publish செய்யவும்
COPY . .
WORKDIR "/src/ZoomTrip.API"
RUN dotnet publish "ZoomTrip.API.csproj" -c Release -o /app/publish

# 2️⃣ Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
# Build ஸ்டேஜில் இருந்து கோப்புகளை காப்பி செய்யவும்
COPY --from=build /app/publish .

# உங்கள் API ரன் ஆகும் போர்ட் (Render-க்கு தேவைப்படலாம்)
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "ZoomTrip.API.dll"]