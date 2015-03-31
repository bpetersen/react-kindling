"use strict";

import Request      from "superagent";
import User         from "../stores/user";
import Constants    from "../constants";
import Dispatcher   from "../dispatcher";

const TIMEOUT = 10000;

let _pendingRequests = {};

function abortPendingRequests(key) {
  if(_pendingRequests[key]) {
    _pendingRequests[key]._callback = function() {};
    _pendingRequests[key].abort();
    _pendingRequests[key] = null;
  }
}

// Get the access token from the user
function token() {
  return User.token();
}

function makeUrl(part) {
  return GlobalSettings.apiUrl + part;
}

// GET request with a token param
function get(url, callback) {
  return Request
    .get(url)
    .timeout(TIMEOUT)
    .set('Accept', 'application/json')
    .query({
      authtoken: token()
    })
    .end(callback);
}

// POST request with a token param
function post(url, body, callback) {
  return Request
    .post(url)
    .send(body)
    .set('Accept', 'application/json')
    .timeout(TIMEOUT)
    .query({
      authtoken: token()
    })
    .end(callback);
}

function dispatch(key, response) {
  Dispatcher.dispatch({
    action: key,
    data: response
  });
}

// Dispatch a response based on the server response
function dispatchResponse(key) {
  return function(err, response) {
    if(err && err.timeout === TIMEOUT) {
      dispatch(Constants.TIMEOUT, response);
    } else if(response.status === 400) {
      dispatch(Constants.NOT_AUTHORIZED, response);
    } else if(!response.ok) {
      dispatch(Constants.ERROR, response);
    } else {
      dispatch(key, response);
    }
  };
}

function doRequest(key, url, callback){
  abortPendingRequests(key);
  let request = _pendingRequests[key] = callback(makeUrl(url));
  request.end(dispatchResponse(key));
  return request;
}

export default {

  get(key, url, callback){
    return doRequest(key, url, function(fullUrl){
      return get(fullUrl, callback);
    });
  },

  post(key, url, body, callback){
    return doRequest(key, url, function(fullUrl){
      return post(fullUrl, body, callback);
    });
  }

};
