// Variables and DOM Elements
var citySearch = "Austin, Texas";
var o = "&appid=";
var w = "b5c36ef4eeed9ba94e305cdb2871e408";
var favs = JSON.parse(localStorage.getItem('favorites')) || ["Austin"];
dayjs.extend(window.dayjs_plugin_utc);

function init () {
    // Write current day to page
    $("#today").text(dayjs().format('dddd, MMM D, YYYY'))
    var cityName = "Austin, Texas"
    currentWeather(cityName);
    // getPhoto(cityName);

}

$(document).ready(function() {
    $("button#search").on("click", function(event) {
        event.preventDefault();
        $("div#forecast").empty();
        var cityName = $("input#searchTerm").val().trim();
        currentWeather(cityName);
        // getPhoto(cityName);
    })
});

function favorites() {
    if (favs) {
        for (var j = 0; j < favs.length; j++) {
            var city = favs[j];
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
                var name = response.name;
                var temp = response.main.temp;
                var wind = response.wind.speed;
                var icon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

                // Write a new entry to favorites
                $("div#favorites").prepend($(/*html*/`
                    <div class="col-4 col-md">
                        <div class="card border-0 bg-transparent d-flex align-items-center">
                            <img class="favIcon" src="${icon}">
                            <div id="fav-body" class="card-body">
                                <p class="card-text text-white">${name}</p>
                                <table class="table table-borderless text-white">
                                    <tbody>
                                        <tr class="favData">
                                            <th scope="row" class="w-auto"><i class="fas fa-temperature-high"></i>${temp}</th>
                                            <th scope="row" class="w-auto"><i class="fas fa-wind"></i>${wind}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `));
            });
        }
    }
}

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
            console.log(response);
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            
            // Get UV Index and Forecast
            oneCall(lon, lat);

            var name = response.name;
            var temp = response.main.temp;
            var wind = response.wind.speed;
            var humid = response.main.humidity;
            var icon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

            // Write weather data to page, UV Index comes from the One Call API
            $("h5#cityState").text(name + " ");
            $("span#tempCurr").text(" " + temp + "F");
            $("span#windCurr").text(" " + wind);
            $("span#humidCurr").text(" " + humid);
            $("img.currentIcon").attr("src", icon);

            var fav = name;
            // Does not save fav values if repeated into local storage
            if (fav.length < 1 || fav === undefined || fav === "") {
                console.log("cannot save an empty event");
            }
            else if (favs.find(function(fav) {
                return item = fav;
            })) {
                console.log(name + " has already been favorited!")
            }
            else {
                // Push city into favs array
                favs.push(fav);
                // Save favs array on local storage
                localStorage.setItem("favorites", JSON.stringify(favs));

                if (favs) {
                    for (var j = 0; j < favs.length; j++) {
                        
                    }
                }

                // Write a new entry to favorites
                $("div#favorites").prepend($(/*html*/`
                    <div class="col-4 col-md">
                        <div class="card border-0 bg-transparent d-flex align-items-center">
                            <img class="favIcon" src="${icon}">
                            <div id="fav-body" class="card-body">
                                <p class="card-text text-white">${name}</p>
                                <table class="table table-borderless text-white">
                                    <tbody>
                                        <tr class="forecastData">
                                            <th scope="row" class="w-auto"><i class="fas fa-temperature-high"></i>${temp}</th>
                                            <th scope="row" class="w-auto"><i class="fas fa-wind"></i>${wind}</th>
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
            console.log(response);
            // Write UV Index to the page
            $("span#uvCurr").text(" " + response.current.uvi);

            // Write forecast to the page
            var forecast = response.daily;
            for (var i = 1; i < 6; i++) {
                var day = forecast[i].dt;
                var formatDay = dayjs.unix(day).format('dddd');
                var temp = " " + forecast[i].temp.day + "F";
                var wind = " " + forecast[i].wind_speed + "mph";
                var icon = "http://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + "@2x.png";

                $("div#forecast").append($(/*html*/`
                    <div class="col-6 col-lg-4">
                        <div class="card border-0 bg-transparent d-flex align-items-center">
                            <img class="weatherIcon" src="${icon}">
                            <div class="card-body">
                                <p class="card-text text-white">${formatDay}</p>
                                <table class="table table-borderless text-white">
                                    <tbody>
                                        <tr class="forecastData">
                                            <th scope="row" class="w-auto"><i class="fas fa-temperature-high"></i>${temp}</th>
                                            <th scope="row" class="w-auto"><i class="fas fa-wind"></i>${wind}</th>
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
    var query = url + "query=" + city + "&content_filter=" + contentFilter + "&featured=" + featured + "&h=500";

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
            console.log(response);
            photo = response;
            $("img#photo").attr("src", photo.urls.regular);
        });

}

init();