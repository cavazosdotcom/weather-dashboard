var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var forecastEl = $('#forecast')

var city = ''
var dataName = ''
var cityName = ''
var favCityList = []

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
            dataName = data[0].name
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

    // console.log(moment(weatherData.current.dt, "X").format("M/D/YYYY"))

    htmlTemplateCurrent = `
    <div class="box has-text-centered">
        <h1 class="small-margin-bottom large-text">${cityName}</h1> 
        <h1 class="small-margin-bottom medium-text">${moment(weatherData.current.dt, "X").format("dddd")}</h1>
        <h1 class="margin-bottom medium-text">${moment(weatherData.current.dt, "X").format("MMM Do, YYYY")}</h1>
        <ul>
            <li>${weatherData.current.weather[0].main}</li>
            <img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="broken clouds" style="width:100px">
            <br>
            <li>Temp: ${Math.round(weatherData.current.temp)}℉</li>
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
            <h1 class="margin-bottom">${moment(weatherData.daily[i].dt, "X").format("dddd")}</h1>
            <ul>
                <li>${weatherData.daily[i].weather[0].main}</li>
                <img src="http://openweathermap.org/img/wn/${dailyIcon}@2x.png" alt="broken clouds" style="width:100px">
                <br>
                <li>Temp: ${Math.round(weatherData.daily[i].temp.day)}℉</li>
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
        <h1 class="black has-text-centered large-text py-">5-Day Forecast:</h1>
        <div id="forecast" class="columns is-desktop m-2">
            ${htmlTemplate}
        </div>   
        `;
    
    forecastEl.append(htmlContainer);
};


// TODO: Saved cities list
// TODO: UV colors
// TODO: Modal for when search isn't fulfilled

favCityList = JSON.parse(localStorage.getItem('favoriteCities')) || []

$('.save-btn').on('click', function(){
    
    var favCityName = dataName

    if (favCityName === '') {
        return console.log(`Please search so we can validate your city`)
    }

    console.log(favCityName)
    /*
    // For loop to check if character is already on favorites list.
    // If they are remove them from the array, save local storage with new favorite character list.
    // Then re-render the favorite character list. 
    */
    for ( var i=0; i < favCityList.length; i++ ) {
        if ( favCityList[i] === favCityName ) {
            // favCityList.splice( i , 1 );
            localStorage.setItem( "favoriteCities" , JSON.stringify( favCityList ));
            // favoriteInputEl.val("");
            return console.log( favCityList );
        };
    };

    // If character name is not already saved to favorite character list, add it to array.
    favCityList = favCityList.concat( favCityName );

    // Saving the updated favorite character array to local storage.
    localStorage.setItem( "favoriteCities" , JSON.stringify( favCityList ));
    // Render favorite character list with the new favorite character list.
    console.log( favCityList );
});

$('.clear-btn').on('click', function(){
    favCityList = [];
    console.log(favCityList)
});