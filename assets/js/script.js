// HTML Selector Variables
var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var forecastEl = $('#forecast');
var savedButtonsEl = $('#saved');

// Variables created to bring values into the global scope
var city = ''
var dataName = ''
var cityName = ''
var historyCityList = []
var favCity;

// apiKey to fetch data from our API's
var apiKey = 'a646f924a03b0b80578a8704a8cb2ed5'



// init function that calls on page load
// Gets favoriteCity from local storage then checks if the object is empty, if not then favorite city is called into our API fetch request function, getGeo();
// Search history buttons are rendered
function init(){
    
    favCity = JSON.parse(localStorage.getItem('favoriteCity')) || [];
    
    if(favCity.favoriteCity !== undefined){
        getGeo(favCity.favoriteCity);
    }; 
    
    renderSavedCities();
};
// Calls the init function
init();


// Form submit event listener for city searchbar
// On form submit calls getGeo() api fetch request with the submitted city 
searchFormEl.on('submit', function(event){
    event.preventDefault();
    city = searchInputEl.val();

    getGeo(city);

    // resets the search input value for fresh form submit next time
    searchInputEl.val('');
});


// Click event listener to search for the city that is clicked from the search history buttons
savedButtonsEl.on('click', function(event){
    var searchSavedCity = event.target.innerText;
    getGeo(searchSavedCity);
});



// Custom API fetch request function for the searched city's location via latitude and longitude
function getGeo( searchVal ) {

    // API Request URL.
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchVal}&limit=5&appid=${apiKey}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function( data ) {

            // latitude and longitude values set from our fetch data
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            
            // 'city' and 'city, state' set as variables
            dataName = data[0].name
            cityName = `${data[0].name}, ${data[0].state}`
            
            // calls second api request
            getWeather( latitude, longitude );

        });
        } else {
            // throws error if city name isn't valid
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            // catch error
            console.log(Error)
            
        });
};



// Custom API fetch request to get weather data of searched city
function getWeather( latitude, longitude ) {

    // API Request URL.
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function( data ) {
            
            // clears the current shown weather boxes
            forecastEl.html('');
            
            // renders weather boxes for current day and forecasted weather for next 5 days
            renderCurrent(data, cityName);
            renderForecast(data);
            
            // function that creates/saves search history array with newest city searched
            searchHistory(dataName);
            
            // function that renders each city in search history as button that can be searched again
            renderSavedCities();
            
        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            console.log(Error)
            
        });
};



// Custom function to render the current days weather forecast based on the city name and the data received about that city
function renderCurrent( data, cityName ) {

    // variable for the weather data
    var weatherData = data
    // variable for the weather icon for picture of weather
    var currentIcon = weatherData.current.weather[0].icon
    // creates variable for our template literal to create our current weather box
    var htmlTemplateCurrent = ''
    // variable for the current weather's UV index number
    var uvNumber = weatherData.current.uvi
    
    // calls custom function to set the UV index to specific color based on the value of the UV index number
    uvIndexScale(uvNumber);
    
    // template literal for weather box
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
    
    // appends box to forecast element on html
    forecastEl.append(htmlTemplateCurrent);
};



// Custom function to render the weather forecast boxes for the next 5 days
function renderForecast( data ) {
    
    var weatherData = data
    
    var htmlTemplateDaily = ''

    // for loop to render each weather forecast box
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
    
    // main html template to maintain flex properties
    var htmlContainer = `
        <h1 class="black has-text-centered large-text py-">5-Day Forecast:</h1>
        <div id="forecast" class="columns is-desktop m-2">
            ${htmlTemplateDaily}
        </div>   
        `;
    
    forecastEl.append(htmlContainer);
};



// Renders the search history array of cities as buttons
function renderSavedCities (){

    // gets history array from local storage
    historyCityList = JSON.parse(localStorage.getItem('searchHistoryCities')) || [];

    var htmlTemplateSaved = '';
    savedButtonsEl.html('');

    // for loop to render each button wiht template literal
    for ( var i=0; i<historyCityList.length; i++){
        htmlTemplateSaved += `
        <button id="${historyCityList[i]}" class="button is-primary is-light is-fullwidth my-2 data-city="${historyCityList[i]}">${historyCityList[i]}</button>
        `;
    };

    savedButtonsEl.append(htmlTemplateSaved);
};



// Creates search history array, and sets to local storage 
function searchHistory(city){
    
    var historyCityName = city

    // for loop checks if city is already in search history array so same city isn't added more than once
    for ( var i=0; i < historyCityList.length; i++ ) {
        if ( historyCityList[i] === historyCityName ) {
            localStorage.setItem( "searchHistoryCities" , JSON.stringify( historyCityList ));
            return;
        };
    };
    
    // adds new city name to history array
    historyCityList = historyCityList.concat( historyCityName );

    // Saving the updated favorite character array to local storage.
    localStorage.setItem( "searchHistoryCities" , JSON.stringify( historyCityList ));

};



// Event listener for save button to save a favorite city in local storage
$('.save-btn').on('click', function(){
    
    var favCityName = dataName

    // logic to log when a city is saved as a favorite, if there was no form submit, don't save
    if (favCityName === '') {
        return console.log(`Please search a city before you save`)
    } else {
        console.log(`${favCityName} has been saved as your favorite city`);
    };
    
    // creates fav city object
    favCity = {
        favoriteCity: favCityName,
    };

    // sets fav city object to local storage
    localStorage.setItem('favoriteCity', JSON.stringify(favCity));

});



// Event Listener to for clear button on click
$('.clear-btn').on('click', function(){
    // clears local storage
    localStorage.clear();
    // clears search history array
    historyCityList = [];
    // clears html element
    savedButtonsEl.html('');
});



// function to set the color styling for the UV Index based the number's value
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
