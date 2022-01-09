var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var city = ''
// var apiKey = 'f30afd0d9c78b669a42b1299a1eee959'
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
            // console.log(data);
            // console.log(data.current.temp)
            // console.log(data.current.wind_speed)
            // console.log(data.current.humidity)
            // console.log(data.current.uvi)
            renderCurrent();
            renderForecast();
            
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

function renderCurrent( ) {
    var htmlTemplateCurrent = `
    <div class="box">
        <h1>Everett (1/01/2021)</h1>
        <ul>
          <img src="http://openweathermap.org/img/wn/04n@2x.png" alt="broken clouds" style="width:100px">
          <li>Temp: 74.01F</li>
          <li>Wind: 6.67 MPH</li>
          <li>Humidity: 46%</li>
          <li>UV index: <span>6.47</span></li>
        </ul>
    </div>
    `;

    $('#forecast').append(htmlTemplateCurrent);
};


function renderForecast( ) {
    var htmlTemplate = ''
    for (var i=1; i < 6; i++){
        console.log(i)
        htmlTemplate += `
        <div class="box m-2 column has-text-centered">
            <h1>(1/0${i}/2021)</h1>
            <ul>
                <img src="http://openweathermap.org/img/wn/04n@2x.png" alt="broken clouds" style="width:100px">
                <li>Temp: 42.01F</li>
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
    
    $('#forecast').append(htmlContainer);
    // $('#forecast').html(htmlTemplate);
};












// searchFormEl.on( 'submit' , formSubmit );