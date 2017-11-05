/*
  app/filter.js

  It is source check response and signature list
  to be filter from danger site.
*/


/* filter response */
var filter = {
  // message used denger_message
   denger_message: 'This site is danger !',

  /* filter strings site */
  string: function(response){
    var signature_list = ['Example'];
    var is_secure = true;

    // check is secure
    for(var signature of signature_list){
      var is_secure = response.indexOf(signature) == -1;

      // if response not secure,
      // response became this.danger_message
      if(!is_secure){
        response = this.denger_message;
        break;
      }
    }

    return response;
  }
}


module.exports = filter;
