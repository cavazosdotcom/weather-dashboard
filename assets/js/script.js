var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');
var city = ''
var apiKey = 'f30afd0d9c78b669a42b1299a1eee959'
// var apiKey = 'a646f924a03b0b80578a8704a8cb2ed5'

// "http://api.openweathermap.org/geo/1.0/direct?q=Everett&limit=5&appid=f30afd0d9c78b669a42b1299a1eee959"

searchFormEl.on('submit', function(event){
    event.preventDefault();
    console.log(searchInputEl.val());
    city = searchInputEl.val();

    getGeo(city);

    searchInputEl.val('');
});
// console.log(city);
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
            // var latitude = data[0].lat;
            console.log(data[0].lon);
            // var longitude = data[0].lon;
            console.log(data[0].name)
            // var name = data[0].name
            console.log(data[0].state)
            // var state = data[0].state
            

        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the city you searched for." );
        }
        })
        .catch( function( Error ) {
            renderModal( Error, "is-warning" );
        });
};

// searchFormEl.on( 'submit' , formSubmit );