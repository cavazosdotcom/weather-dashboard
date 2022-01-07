var searchInputEl = $( '#search-value' );
var searchFormEl = $('#search-input');



searchFormEl.on('submit', function(event){
    event.preventDefault();
    console.log(searchInputEl.val())
})

// searchFormEl.on( 'submit' , formSubmit );