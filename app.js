/**
 * Created by Matthias on 24.05.14.
 */
(function () {
    var app = angular.module('tippspiel', ['ui.bootstrap']);

    var TippCtrl = function ($scope, $modalInstance, tipp) {

        $scope.tipp = tipp;


        $scope.ok = function () {
            $modalInstance.close($scope.tipp);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    app.controller('TippspielController', function ($scope, $modal, $http) {

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
                    }
                }
            });

            modalInstance.result.then(function (tipp) {
                if(tipp != undefined){
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


        $scope.meineTipps = {1:200 };

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

    app.controller('PanelController', function ($scope) {
        this.tab = 1;
        this.selectTab = function (setTab) {
            this.tab = setTab;
        };
        this.isSelected = function (selectedTab) {
            return this.tab === selectedTab;
        }
    });

    app.controller('TabController', function () {

    });
    app.controller('TippController', function ($scope) {
        $scope.myTipps = [];
//        $scope.newTipp = [];
        $scope.addTipp = function (newTipp) {
            $scope.myTipps.push(newTipp);
        };


    });



})();


