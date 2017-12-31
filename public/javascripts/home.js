angular.module('twiLu').controller('homeController', function ($scope, $http, $timeout) {

  $scope.username = "";
  $scope.date = null;
  $scope.tweet = "";
  $scope.results = [];

  function setup() {
  }

  $scope.search = function() {
    var query = '';
    var username = ($scope.userName === undefined)?'':String($scope.userName).trim();
    var terms = ($scope.tweetText === undefined)?'':String($scope.tweetText).trim();
    var count = ($scope.tweetCount === undefined)?'':String($scope.tweetCount).trim().toLowerCase();
    var institute = ($scope.instituteName === undefined)?'':String($scope.instituteName).trim();
    var publisher = ($scope.publisherName === undefined)?'':String($scope.publisherName).trim();

    query += (terms!='') ? '(题名:'+terms+'OR 摘要:'+terms+')' : '(题名:计算机 OR 摘要:计算机)';
    query += (username!='') ? ((query!='') ? (' AND (作者:"'+username+'")') : ('(作者:"'+username+'")')) : '';
    query += (institute!='') ? ((query!='') ? (' AND (单位:'+institute+')') : ('(单位:'+institute+')')) : '';
    query += (publisher!='') ? ((query!='') ? (' AND (来源:'+publisher+')') : ('(来源:'+publisher+')')) : '';

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

angular.module("twiLu").filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
