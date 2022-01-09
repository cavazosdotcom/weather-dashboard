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

    var htmlTemplateCurrent = ''
    htmlTemplateCurrent = `
    <div class="box">
        <h1>${cityName} (1/01/2021)</h1>
        <ul>
          <img src="http://openweathermap.org/img/wn/04n@2x.png" alt="broken clouds" style="width:100px">
          <li>Temp: ${weatherData.current.temp}</li>
          <li>Wind: ${weatherData.current.wind_speed} MPH</li>
          <li>Humidity: ${weatherData.current.humidity}%</li>
          <li>UV index: <span>${weatherData.current.uvi}</span></li>
        </ul>
    </div>
    `;

    forecastEl.append(htmlTemplateCurrent);
};


function renderForecast( data ) {
    
    var weatherData = data
    var htmlTemplate = ''
    for (var i=0; i < 5; i++){
        console.log(i)
        htmlTemplate += `
        <div class="box m-2 column has-text-centered">
            <h1>(1/0${i}/2021)</h1>
            <ul>
                <img src="http://openweathermap.org/img/wn/04n@2x.png" alt="broken clouds" style="width:100px">
                <li>Low Temp: ${Math.round(weatherData.daily[i].temp.min)}℉</li>
                <li>High Temp: ${Math.round(weatherData.daily[i].temp.max)}℉</li>
                <li>Wind: 9.0 MPH</li>
                <li>Humidity: 50%</li>
                <li>UV index: <span>1.09</span></li>
            </ul>
        </div>
        `;
    };
    

    
    var htmlContainer = `
        <h1 class="black py-">5-Day Forecast:</h1>
        <div id="forecast" class="columns is-desktop m-2">
            ${htmlTemplate}
        </div>   
        `;
    
    forecastEl.append(htmlContainer);
};












// searchFormEl.on( 'submit' , formSubmit );