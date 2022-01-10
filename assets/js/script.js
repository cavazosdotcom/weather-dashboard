var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var city = ''
var forecastEl = $('#forecast')
var cityName = ''
var apiKey = 'a646f924a03b0b80578a8704a8cb2ed5'


searchFormEl.on('submit', function(event){
    event.preventDefault();
    console.log(searchInputEl.val());
    city = searchInputEl.val();

    getGeo(city);

    searchInputEl.val('');
});



function getGeo( searchVal ) {

    // API Request URL.
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchVal}&limit=5&appid=${apiKey}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function( data ) {
            // console.log(data);
            console.log(data[0].lat);
            var latitude = data[0].lat;
            console.log(data[0].lon);
            var longitude = data[0].lon;
            console.log(data[0].name)
            cityName = `${data[0].name}, ${data[0].state}`
            // var name = data[0].name
            console.log(data[0].state)
            // var state = data[0].state
            
            getWeather( latitude, longitude );

        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            renderModal( Error, "is-warning" );
        });
};



function getWeather( latitude, longitude ) {

    // API Request URL.
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function( data ) {
            console.log(data);
            // console.log(data.current.temp)
            // console.log(data.current.wind_speed)
            // console.log(data.current.humidity)
            // console.log(data.current.uvi)
            forecastEl.html('');
            console.log(cityName)
            renderCurrent(data, cityName);
            renderForecast(data);
            
        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            // renderModal( Error, "is-warning" );
            console.log('catch error')
        });
};

function renderCurrent( data, cityName ) {

    var weatherData = data
    var currentIcon = weatherData.current.weather[0].icon
    var htmlTemplateCurrent = ''

    

    htmlTemplateCurrent = `
    <div class="box has-text-centered">
        <h1 class="small-margin-bottom">${cityName}</h1> 
        <h1 class="margin-bottom">(1/01/2021)</h1>
        <ul>
            <li>${weatherData.current.weather[0].main}</li>
            <img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="broken clouds" style="width:100px">
            <br>
            <li>Temp: ${weatherData.current.temp}℉</li>
            <br>
            <li>${Math.round(weatherData.daily[0].temp.min)}℉  -  ${Math.round(weatherData.daily[0].temp.max)}℉</li>
            <br>
            <li>Wind: ${weatherData.current.wind_speed} MPH</li>
            <br>
            <li>Humidity: ${weatherData.current.humidity}%</li>
            <br>
            <li>UV index: <span>${weatherData.current.uvi}</span></li>
        </ul>
    </div>
    `;

    forecastEl.append(htmlTemplateCurrent);
};


function renderForecast( data ) {
    
    var weatherData = data
    // console.log(weatherIcon)
    // iconUrl = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`
    var htmlTemplate = ''
    for (var i=1; i < 6; i++){
        var dailyIcon = weatherData.daily[i].weather[0].icon
        htmlTemplate += `
        <div class="box m-2 column has-text-centered">
            <h1 class="margin-bottom">(1/0${i}/2021)</h1>
            <ul>
                <li>${weatherData.daily[i].weather[0].main}</li>
                <img src="http://openweathermap.org/img/wn/${dailyIcon}@2x.png" alt="broken clouds" style="width:100px">
                <br>
                <li>Temp: ${weatherData.daily[i].temp.day}℉</li>
                <br>
                <li>${Math.round(weatherData.daily[i].temp.min)}℉  -  ${Math.round(weatherData.daily[i].temp.max)}℉</li>
                <br>
                <li>Wind: ${weatherData.daily[i].wind_speed} MPH</li>
                <br>
                <li>Humidity: ${weatherData.daily[i].humidity}%</li>
                <br>
                <li>UV index: <span>${weatherData.daily[i].uvi}</span></li>
            </ul>
        </div>
        `;
    };
    

    
    var htmlContainer = `
        <h1 class="black has-text-centered py-">5-Day Forecast:</h1>
        <div id="forecast" class="columns is-desktop m-2">
            ${htmlTemplate}
        </div>   
        `;
    
    forecastEl.append(htmlContainer);
};



// searchFormEl.on( 'submit' , formSubmit );