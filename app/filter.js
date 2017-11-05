/*
  app/filter.js

  It is source filtering response.
*/


/* filter response */
var filter = {
  string: function(response){

    while (response.indexOf('Yahoo', 0) != -1){
      response = response.replace('Yahoo', 'hogeee');
    }

    return response;
  }
}


module.exports = filter;
