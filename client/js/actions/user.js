"use strict";

import Constants   from   "../constants";
//import Api         from   "./api";
import Dispatcher  from "../dispatcher";
import WebAPIUtils from "../utils/WebAPIUtils.js";

export default {

  login(payload){
    Dispatcher.dispatch({ action: Constants.LOGIN_PENDING });
    WebAPIUtils.login(payload);
    //Api.post(Constants.LOGIN, "sessions/", payload);
  },

  register(payload) {
    Dispatcher.dispatch({ action: Constants.REGISTER_PENDING });
    WebAPIUtils.register(payload);
    //Api.post(Constants.REGISTER, "users/", payload);
  }

};
