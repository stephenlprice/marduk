// Variables and DOM Elements
var citySearch = "Austin, Texas";
var o = "&appid=";
var w = "b5c36ef4eeed9ba94e305cdb2871e408";
// // This line grabs the input from the textbox
// var movie = $("#movie-input").val().trim();

var endpointCurrentWeather = {
    "coord": {
        "lon": -122.08,
        "lat": 37.39
    },
    "weather": [
        {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 282.55,
        "feels_like": 281.86,
        "temp_min": 280.37,
        "temp_max": 284.26,
        "pressure": 1023,
        "humidity": 100
    },
    "visibility": 16093,
    "wind": {
        "speed": 1.5,
        "deg": 350
    },
    "clouds": {
        "all": 1
    },
    "dt": 1560350645,
    "sys": {
        "type": 1,
        "id": 5122,
        "message": 0.0139,
        "country": "US",
        "sunrise": 1560343627,
        "sunset": 1560396563
    },
    "timezone": -25200,
    "id": 420006353,
    "name": "Mountain View",
    "cod": 200
};

function init () {
    // Write current day to page
    $("#today").text(dayjs().format('dddd, MMM D, YYYY'))

}

$(document).ready(function() {

    $("button#search").on("click", function(event) {
        event.preventDefault();
        var cityName = $("input#searchTerm").val().trim();
        console.log(cityName);
        currentWeather(cityName);
        // getPhoto(cityName);
    })
});

// Calls the Current Weather Endpoint
function currentWeather(term) {
    var city = term;
    var url = "https://api.openweathermap.org/data/2.5/weather?q=";
    var unit = "&units=imperial";
    var lang = "&lang=en";
    // AJAX query for Current Weather Endpoint
    var query = url + city + unit + lang + o + w;

    $.ajax({
        url: query,
        method: "GET",
        async: true,
        crossDomain: true
      }).then(function(response) {
            console.log(query);
            console.log(response);
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            
            // Get UV Index and Forecast
            oneCall(lon, lat);

            // Write weather data to page, UV Index comes from the One Call API
            $("h5#cityState").text(response.name + " ");
            $("span#tempCurr").text(" " + response.main.temp + "F");
            $("span#windCurr").text(" " + response.wind.speed);
            $("span#humidCurr").text(" " + response.main.humidity);
            $("img.currentIcon").attr("src", response.weather.icon);
        });
}

// Calls the One Call Endpoint
function oneCall(lon, lat){
    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    var latitude = "lat=" + lat;
    var longitude = "&lon=" + lon;
    var url = "https://api.openweathermap.org/data/2.5/onecall?";
    var unit = "&units=imperial";
    var lang = "&lang=en";
    var exclude = "&exclude=hourly,minutely";
    // AJAX query for One Call Endpoint
    var query = url + latitude + longitude + unit + lang + exclude + o + w;

    $.ajax({
        url: query,
        method: "GET",
        async: true,
        crossDomain: true
      }).then(function(response) {
            console.log(query);
            console.log(response);
            // Write UV Index to the page
            $("span#uvCurr").text(" " + response.current.uvi);

            // Write forecast to the page
            var forecast = response.daily;
            for (var i = 0; i < forecast.length; i++) {
                var day = forecast[i].dt;
                var temp = forecast[i].temp.day;
                var wind = forecast[i].wind_speed;
                var icon = forecast[i].weather.icon;

                $("div#forecast").append($(/*html*/`
                    <div class="col-6 col-lg-4">
                        <div class="card border-0 bg-transparent">
                            <i class="fas fa-sun" style="font-size: 3.5em; text-align: center;"></i>
                            <div class="card-body">
                                <p class="card-text text-white" style="text-align: center;">Tomorrow</p>
                                <table class="table table-borderless text-white">
                                    <tbody>
                                        <tr style="text-align: center; font-size: 0.75em;">
                                            <th scope="row" class="w-auto"><i class="fas fa-temperature-high"></i> 88F</th>
                                            <th scope="row" class="w-auto"><i class="fas fa-wind"></i> 30mph</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `));
            }
        });
}

// Calls the Unsplash API
function getPhoto(term) {
    var url = "https://api.unsplash.com/photos/random?";
    var city = term;
    var contentFilter = "high";
    var featured = true;
    // AJAX query for Unsplash API
    var query = url + "query=" + city + "&content_filter=" + contentFilter + "&featured=" + featured;

    $.ajax({
        url: query,
        method: "GET",
        async: true,
        crossDomain: true,
        headers: {
            "Accept-Version": "v1",
            "X-Total": 1,
          },
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + "Client-ID rznpVZu00FVXBm1nMh7YPVqixLxF3Kt9c35OUq5NDcw");
        }
      }).then(function(response) {
            console.log(query);
            console.log(response);
            photo = response;
            $("img#photo").attr("src", photo.urls.regular);
        });

}

init();