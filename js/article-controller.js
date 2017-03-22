var app = angular.module('app', ['ngProgress','infinite-scroll']);

app.controller('articleCtrl', function($scope, $location, $http,ngProgressFactory) {

    $scope.recommendations = [];
    $scope.numberToDisplay = 5;
    $scope.results = [];
  
	$scope.progressbar = ngProgressFactory.createInstance();
	$scope.progressbar.setHeight('3px');
	$scope.progressbar.setColor('#BF3133');
	$scope.progressbar.start();

	var url = "http://localhost/articles/api.php";

    $http.get(url)
        .then(function(response){
            var array = $.map(response.data.list, function(value, index) {
                return [value];
            });
            $scope.results = array.reverse();
			$scope.progressbar.complete();
        });

    $scope.search = function(searchText){
        $scope.searchText = searchText;
    };

    $scope.loadMore = function(){
       if ($scope.numberToDisplay + 5 < $scope.results.length) {
           $scope.numberToDisplay += 5;
       } else {
           $scope.numberToDisplay = $scope.results.length;
       }
    };


});

app.filter( 'domain', function () {
	return function (input) {
		var parser = document.createElement('a');
		parser.href = input;
		return parser.hostname;
	};
});

app.filter('trim', function () {
    return function (value, wordwise, max, tail) {
        if (!value){return '';}

        max = parseInt(max, 10);
        if (!max){return value;}
        if (value.length <= max){ return value;}

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});