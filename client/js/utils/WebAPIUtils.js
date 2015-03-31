//To see the role of the api in flux, see: https://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html
'use strict';
// include action creators
import Api         from   "./WebAPI";
import Constants   from   "../constants";

export default {
  login(payload){
    Api.post(Constants.LOGIN, "sessions/", payload, (err, res) => {
      if(!err){
        Dispatcher.dispatch({ action: Constants.LOGIN_SUCCESS });
      }
      else {
        console.log('There was an error logging in user');
        Dispatcher.dispatch({ action: Constants.LOGIN_FAILURE,}
      }

    });
    
  }
};
