var tippspielControllers = angular.module('tippspielControllers', ['ui.bootstrap']);

tippspielControllers.controller('TippspielController', function ($scope, USER_ROLES, AuthService, $modal, $http) {

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.tippAvailable = function (partieId) {
        if ($scope.meineTipps[partieId] == undefined) {
            return true;
        } else {
            return false;
        }
    };

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.viewTipp = function (partieId) {
        var modalInstance = $modal.open({
            templateUrl: 'tippModalForm.html',
            controller: TippCtrl,
            size: 'lg',
            resolve: {
                tipp: function () {
                    return $scope.meineTipps[partieId];
                },
                partie: function () {
                    return $scope.partien[partieId];
                }
            }
        });

        modalInstance.result.then(function (tipp) {
            if (tipp != undefined) {
//                    if(meineTipps[tipp.partieId]) {
                $scope.meineTipps[tipp.partieId] = tipp;
//                    }
            }
        }, function () {
//               $log.info('Modal dismissed at: ' + new Date());
//               alert("blub")
        });
    };


    $scope.showSpielplan = [
        {'name': 'Gruppe A', show: true, filter: 'Gruppenspiel A'},
        {'name': 'Gruppe B', show: false, filter: 'Gruppenspiel B'},
        {'name': 'Gruppe C', show: true, filter: 'Gruppenspiel C'},
        {'name': 'Gruppe D', show: true, filter: 'Gruppenspiel D'},
        {'name': 'Gruppe E', show: true, filter: 'Gruppenspiel E'},
        {'name': 'Gruppe F', show: true, filter: 'Gruppenspiel F'},
        {'name': 'Gruppe G', show: true, filter: 'Gruppenspiel G'},
        {'name': 'Gruppe H', show: true, filter: 'Gruppenspiel H'},
        {'name': 'Achtelfinale', show: true, filter: 'Achtelfinale'},
        {'name': 'Viertelfinale', show: true, filter: 'Viertelfinale'},
        {'name': 'Halbfinale', show: true, filter: 'Halbfinale'},
        {'name': 'Finale', show: true, filter: 'Finale'},
    ];

    $scope.meineTipps = {};
    $scope.checkTipp = function (id) {
        console.log($scope.meineTipps[id].mannschaft1);
        if ($scope.meineTipps[id].mannschaft1 != 0 && $scope.meineTipps[id].mannschaft1 != 0) {
            $scope.meineTipps[id].valid = true;
        }

    }

    $scope.saveTipp = function (partieId) {
        $scope.meineTipps[partieid].mannschaft1 = curr

    }

    $scope.partien = [];
    $scope.init = function () {
        var mannschaften;

        $http.get('./data/mannschaften.json').then(function (mannschaftenJson) {
            mannschaften = mannschaftenJson.data;
            console.log("mannschaften geholt");
            $http.get('./data/partien.json').then(function (partienJson) {
                console.log("partien geholt");
                var partien = partienJson.data;
                $scope.partien = partien;

                var mannschaftenDict = {};
                for (var i = 0; i < mannschaften.length; i++) {
                    mannschaftenDict[mannschaften[i].id] = mannschaften[i];
                }

                var partienDict = {};
                for (var i = 0; i < partien.length; i++) {
                    partienDict[partien[i].id] = partien[i];
                    partien[i].mannschaft1 = mannschaftenDict[partien[i].mannschaft1];
                    partien[i].mannschaft2 = mannschaftenDict[partien[i].mannschaft2];
                    var now = new Date(partien[i].datum);
                    partien[i].datum = new Date(now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate(),
                        now.getUTCHours(),
                        now.getUTCMinutes(),
                        now.getUTCSeconds());
                    //  console.log(i+partien[i].datum);
                    $scope.meineTipps[partien[i].id] = {};
                }

            });


//
//                    for(var i = 0; i<partien.data.length; i++) {
//                        var partie = partien.data[i];
//                        console.log(mannschaft.id + " " + mannschaft.name );
//                }

//            })

        });
        console.log("init ferti");
    };

    $scope.init();

    $scope.getPartie = function (partieId) {
        if (partieId == undefined) return null;
        var partie;
        angular.forEach(this.partien, function (value, key) {
            if (value.id == partieId) {
                partie = value;
                return;
            }
        });
        return partie;
    };
});

tippspielControllers.controller('PanelController', function ($scope) {
    $scope.isSelected = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';
        return page === currentRoute ? 'true' : 'false';
    };
});

tippspielControllers.controller('TabController', function () {

});
tippspielControllers.controller('TippController', function ($scope) {
    $scope.myTipps = [];
//        $scope.newTipp = [];
    $scope.addTipp = function (newTipp) {
        $scope.myTipps.push(newTipp);
    };


});

tippspielControllers.controller('LoginController', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
    $scope.credentials = {
        username: '',
        password: ''
    };
    $scope.login = function (credentials) {
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
});

tippspielControllers.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

tippspielControllers.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});

tippspielControllers.factory('AuthService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
        return $http
            .post('/login', credentials)
            .then(function (res) {
                Session.create(res.id, res.user.id, res.user.role);
                return res.user;
            });
    };

    authService.isAuthenticated = function () {
        return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authService;
});

tippspielControllers.service('Session', function () {
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
});




