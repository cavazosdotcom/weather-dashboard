var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var forecastEl = $('#forecast');
var savedButtonsEl = $('#saved');

var city = ''
var dataName = ''
var cityName = ''
var favCityList = []

var apiKey = 'a646f924a03b0b80578a8704a8cb2ed5'

init();




searchFormEl.on('submit', function(event){
    event.preventDefault();
    city = searchInputEl.val();

    getGeo(city);

    searchInputEl.val('');
});

savedButtonsEl.on('click', function(event){
    var searchSavedCity = event.target.innerText;
    console.log(searchSavedCity)
    getGeo(searchSavedCity);
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
            // console.log(data[0].lat);
            var latitude = data[0].lat;
            // console.log(data[0].lon);
            var longitude = data[0].lon;
            // console.log(data[0].name)
            cityName = `${data[0].name}, ${data[0].state}`
            dataName = data[0].name
            // console.log(data[0].state)
            // var state = data[0].state
            
            getWeather( latitude, longitude );

        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            // renderErrorModal( Error, "is-warning" )
            console.log(Error)
            
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
            // console.log(data);
            // console.log(data.current.temp)
            // console.log(data.current.wind_speed)
            // console.log(data.current.humidity)
            // console.log(data.current.uvi)
            forecastEl.html('');
            // console.log(cityName)
            renderCurrent(data, cityName);
            renderForecast(data);
            
        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            console.log(Error)
            
            // renderErrorModal( Error, "is-warning" )
        });
};

function renderCurrent( data, cityName ) {

    var weatherData = data
    var currentIcon = weatherData.current.weather[0].icon
    var htmlTemplateCurrent = ''
    var uvNumber = weatherData.current.uvi
    // console.log(moment(weatherData.current.dt, "X").format("M/D/YYYY"))

    uvIndexScale(uvNumber);
    
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
            <li>UV index: <span style="color:${color}">${uvNumber}</span></li>
        </ul>
    </div>
    `;
    
    forecastEl.append(htmlTemplateCurrent);
};


function renderForecast( data ) {
    
    var weatherData = data
    
    var htmlTemplateDaily = ''
    for (var i=1; i < 6; i++){
        var dailyIcon = weatherData.daily[i].weather[0].icon
        var uvNumber2 = weatherData.daily[i].uvi
        uvIndexScale(uvNumber2);
        htmlTemplateDaily += `
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
                <li>UV index: <span style="color:${color}">${uvNumber2}</span></li>
            </ul>
        </div>
        `;
    };
    
    
    var htmlContainer = `
        <h1 class="black has-text-centered large-text py-">5-Day Forecast:</h1>
        <div id="forecast" class="columns is-desktop m-2">
            ${htmlTemplateDaily}
        </div>   
        `;
    
    forecastEl.append(htmlContainer);
};


function renderSavedCities (){
    favCityList = JSON.parse(localStorage.getItem('favoriteCities')) || []
    // console.log(favCityList);
    var htmlTemplateSaved = '';
    savedButtonsEl.html('');
    for ( var i=0; i<favCityList.length; i++){
        htmlTemplateSaved += `
        <button id="${favCityList[i]}" class="button is-primary is-light is-fullwidth my-2 data-city="${favCityList[i]}">${favCityList[i]}</button>
        `;
    };

    savedButtonsEl.append(htmlTemplateSaved);
};

// TODO: Change saved to search history, have one saved city that loads on refresh

// TODO: Modal for when search isn't fulfilled


$('.save-btn').on('click', function(){
    
    var favCityName = dataName

    if (favCityName === '') {
        return console.log(`Please search a city before you save`)
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
    renderSavedCities();
});


$('.clear-btn').on('click', function(){
    localStorage.clear();
    favCityList = [];
    savedButtonsEl.html('');
    console.log(favCityList)
});


function uvIndexScale(number){
    if(number <= 2){
        color = `#01F341`;
    } else if(number <= 5){
        color = `#F6FF34`;
    } else if(number <= 7){
        color = `#F8AA00`;
    } else if(number <= 10){
        color = `#FF3748`;
    } else if(number > 10){
        color = `#D07BFF`;
    }
    return color;
};

function init(){
    renderSavedCities()
}