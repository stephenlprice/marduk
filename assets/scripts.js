// Variables and DOM Elements
var cityName = "austin, texas";
var state = "texas";


function init () {
    // Write current day to page
    $("#today").text(dayjs().format('dddd, MMM D, YYYY'))

}

$(document).ready(function() {


});


// Calls the OpenWeather API
function weatherDetail() {
    var apikey = "&appid=b5c36ef4eeed9ba94e305cdb2871e408";
    var url = "https://api.openweathermap.org/data/2.5/weather?q=";
    var unit = "&unit=imperial";
    var lang = "&lang=en";
    // AJAX query for OpenWeather API
    var query = url + cityName + unit + lang + apikey;

    $.ajax({
        url: query,
        method: "GET",
        async: true,
        crossDomain: true
      }).then(function(response) {
            console.log(query);
            console.log(response);
        });
}

// Method 2 ask Deep!
// var query = {
//     "url": "https://api.openweathermap.org/data/2.5/weather",
//     "apikey": "b5c36ef4eeed9ba94e305cdb2871e408",
//     "?q=": cityName,
//     "units": "imperial",
//     "lang": "en" 
// };
// function getWeatherDetail() {
//     var serialized = $.param(query);
//     var settings = {
//         "async": true,
//         "crossDomain": true,
//         "method": "GET",
//         "query": serialized
//     };
//     $.ajax(settings).done(function (response) {
//         console.log(response);
//       });
// }

// Calls the Unsplash API
function getPhoto() {
    var url = "https://api.unsplash.com/photos/random?";
    var term = cityName;
    var contentFilter = "high";
    var featured = true;
    // AJAX query for Unsplash API
    var query = url + "query=" + term + "&content_filter=" + contentFilter + "&featured=" + featured;

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
        });

}

init();


  
  