/**
 * Created by Matthias on 24.05.14.
 */
var app = angular.module('tippspiel', ['ngRoute', 'tippspielControllers']);

//    .config(function($routeProvider) {
    app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'partials/home.html'
//        controller: 'TippspielController'
    })
        .when('/tipps', {
            templateUrl: 'partials/tipps.html',
            controller: 'TippController'
        })
        .when('/spielplan', {
            templateUrl: 'partials/spielplan.html',
            controller: 'TippController'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        })
        .otherwise({
            redirect: '/home'
        });
}]);
//});

//    var TippCtrl = function ($scope, $modalInstance, tipp, partie) {
//
//        $scope.partie = partie;
//        $scope.tipp = tipp;
//
//
//        $scope.ok = function () {
//            $modalInstance.close($scope.tipp);
//        };
//
//        $scope.cancel = function () {
//            $modalInstance.dismiss('cancel');
//        };
//
//        $scope.existingTipp = function () {
//            return $scope.tipp != undefined;
//        }
//    };

