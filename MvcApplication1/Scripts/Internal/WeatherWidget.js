//current weather URL
var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?";
var UrlParams = "&units=imperial&type=accurate&mode=json";
// forecast URL
var Forecast_URL = "http://api.openweathermap.org/data/2.5/forecast/daily?";
var ForeCast_Params = "&cnt=5&units=imperial&type=accurate&mode=json";
// Image base URL
var IMG_URL = "http://openweathermap.org/img/w/";
var latitude;
var longitude;
/*
	USING Bing MAP API
*/
var map = null;
$(document).ready(function () {
    GetMap();
    getCurrentWeatherData();
    $('#submit').click(function () {
        ClickGeocode();
    });
});
function GetMap() {
    // Initialize the map
    map = new Microsoft.Maps.Map($("#mapDiv")[0], { credentials: "AkXIZ2MIAbgoteGb6PSj9R1LsmFX-zCIlT6DY1FrLWbQsPXStxOMUSoNJzprQhHg", mapTypeId: Microsoft.Maps.MapTypeId.road });
}

function ClickGeocode(credentials) {
    map.getCredentials(MakeGeocodeRequest);
}

function MakeGeocodeRequest(credentials) {

    var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?query=" + encodeURI($("#txtQuery")[0]["value"]) + "&output=json&jsonp=GeocodeCallback&key=" + credentials;
    CallRestService(geocodeRequest);
}

function GeocodeCallback(result) {
    console.log("Found location: " + result.resourceSets[0].resources[0].name);
    if (result &&
           result.resourceSets &&
           result.resourceSets.length > 0 &&
           result.resourceSets[0].resources &&
           result.resourceSets[0].resources.length > 0) {
        // Set the map view using the returned bounding box
        var bbox = result.resourceSets[0].resources[0].bbox;
        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
        map.setView({ bounds: viewBoundaries });

        // Add a pushpin at the found location
        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        latitude = result.resourceSets[0].resources[0].point.coordinates[0];
        longitude = result.resourceSets[0].resources[0].point.coordinates[1];
        getCurrentWeatherData();
        var pushpin = new Microsoft.Maps.Pushpin(location);
        map.entities.push(pushpin);
    }

}

function CallRestService(request) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", request);
    document.body.appendChild(script);
}

/*
	Getting weather data from openweathermap
*/

function getCurrentWeatherData() {
    // Build the OpenAPI URL for current Weather
    var WeatherNowAPIurl = BASE_URL + "lat=" + latitude + "&lon=" + longitude + UrlParams;
    var WeatherForecast_url = Forecast_URL + "lat=" + latitude
			+ "&lon=" + longitude + ForeCast_Params;
    // OpenWeather API call for Current Weather
    $.getJSON(WeatherNowAPIurl, Parse);
    // OpenWeather API call for Forecast Weather
    $.get(WeatherForecast_url, Forecast);
}
// display the current weather and location
function Parse(obj) {
    // current Location
    $('#location').html("Country :"
            + obj.sys.country + "<br>" + "City :" + obj.name + "<br>"
            + "Latitude:" + obj.coord.lat + "<br>" + "Longitude:"
            + obj.coord.lon + "<br>");
    // current weather
    $("#weatherNow").html("<img src='" + IMG_URL
            + obj.weather[0].icon + ".png'> " + "<br> Condition:"
            + obj.weather[0].description + "<br>" + "Temp:" + obj.main.temp
            + " F<br>" + "Humidity:" + obj.main.humidity + " hPa <br>"
            + "Cloudiness:" + obj.clouds.all + "% <br>" + "Wind:"
            + obj.wind.speed + " mps <br>");
}
// display forecasts for next 5 Days
function Forecast(obj) {
    for (i = 0; i < 5; i++) {
        $("#day" + (i + 1) + "div").html("<img src='" + IMG_URL
            + obj.list[i].weather[0].icon + ".png'> " + "<br>Min Temp:"
            + obj.list[i].temp.min + " F<br>" + "Max Temp:"
            + obj.list[i].temp.max + " F<br>" + "Weather :"
            + obj.list[i].weather[0].description + "<br>" + "Cloudiness:"
            + obj.list[i].clouds + " %<br>" + "Wind:" + obj.list[i].speed
            + " mps <br>");
    }
}