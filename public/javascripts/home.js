angular.module('twiLu').controller('homeController', function ($scope, $http, $timeout) {

  $scope.username = "";
  $scope.date = null;
  $scope.tweet = "valium";
  $scope.results = [];

  function setup() {
  }

  $scope.search = function() {
    var query = '';
    var username = ($scope.userName === undefined)?'':String($scope.userName).trim();
    var terms = ($scope.tweetText === undefined)?'':String($scope.tweetText).trim();
    var count = ($scope.tweetCount === undefined)?'':String($scope.tweetCount).trim().toLowerCase();
    query += (username!='')?('username:'+username + ((terms!='')?' AND text:'+terms :''))
      :(terms!='') ? 'text:'+terms :'text:valium';
    count = (count==='all'||count==='*')?'all'
      :(count!=''&&Number.isInteger(parseInt(count)))?parseInt(count):500;
    var searchMessage = "Querying " + count + " documents for '" + query 
      +"'. It can take a while. "; 
    $scope.searchMsg = searchMessage;
    // var uriparams = encodeURIComponent('query='+query.trim()+'&count='+count);
    var uriparams = 'query='+query.trim()+'&count='+count;
    var uri = getServer()+'/search?'+uriparams;
    console.log('Public:'+uri);
    $scope.results = [];
    $http.get(uri).then(function(response) {
      if (response.status === 200) {
        $scope.results = response.data.records;
        var searchMessage = response.data.retrieved +" records retrieved.";
        searchMessage += (response.data.available != '-1')?
          (" Total "+response.data.available+" records found."):"";
        console.log('Public:Success ' + searchMessage);
        $('#search-results').removeClass('hidden');
        $scope.searchMsg = searchMessage;
      } else {
        console.log('Public:' + response.data.error);
        $scope.searchMsg = "Failed!! Check query and try again.";
      }
    });
  }

});
