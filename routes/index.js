// Node's server side handling file
// Receive search call and call the rest api
// Get response and return to client side

var express = require('express');
var router = express.Router();
var request = require('request');

const API_URI = require('../bin/settings').LUCENE_SERVICES_URI;

router.get('/', function(req, res) {
  try {
    console.log('Route : / from index');
    res.render('home');
  } catch (error) {
    console.log('Route : ' + error);
    res.render('error');
  }
});

router.get('/search', function(req, res) {
  var result;
  console.log('Route: /search ' + req.query);
  try {
    if (typeof(req.query.query) === 'string') {
      var query = String(req.query.query.trim());
      var count = String(req.query.count.trim());
      var uri = API_URI+'search?query='+query+'&count='+count;
      console.log('Route: The uri is \''+uri+'\'');
      request.get(uri, function (error, response, body) {
        if (response && response.statusCode === 200) {
          var rawRecords = JSON.parse(body);
          console.log('Route: Success '+ rawRecords.records.length + ' retrieved.');
          result = {
            status: 200,
            retrieved: rawRecords.retrieved,
            available: rawRecords.available,
            records: rawRecords.records
          };
        } else if (error) {
          var errorMsg = 'Route: Failed to call API';
          console.error(errorMsg + ":" + error);
          result = {status: 500, error: errorMsg};
        } else {
          var errorMsg = 'Route:Search failed to retrieve records from lucene services API';
          console.error(errorMsg + ":" + (response)?body:'');
          result = {status: 500, error: errorMsg};
        }
        res.status(result.status).send(result);
      });
    } else {
      var errorMsg = 'Route: Bad Search query';
      console.warn(errorMsg + ":" + String(req.query.query));
      result = {status: 400, error: errorMsg};
      res.status(result.status).send(result);
    }
  } catch (err) {
    var errorMsg = 'Route:Failed to retrieve records from lucene services  API';
    console.error(errorMsg + ":" +err);
    result = {status: 500, error: errorMsg};
    res.status(result.status).send(result);
  }
});

module.exports = router;
