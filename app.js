/**
 * Created by Matthias on 24.05.14.
 */
(function () {
    var app = angular.module('tippspiel',[]);

    app.controller('TippspielController', [ '$http', function ($http) {
        this.init = function() {
            $http.get('./data/mannschaften.json').then(function(mannschaft) {
                console.log(""+mannschaft.id)
            })
        }

        this.init();
        this.partien = partien;

        this.getPartie = function (partieId) {
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
    }]);

    app.controller('PanelController', function () {
        this.tab = 1;
        this.selectTab = function (setTab) {
            this.tab = setTab;
        };
        this.isSelected = function (selectedTab) {
            return this.tab === selectedTab;
        }
    });

    app.controller('TabController', function() {

    });
    app.controller('TippController', function () {
        this.myTipps = meineTipps;
        this.newTipp = [];
        this.addTipp = function (tipp) {
            myTipps.push(tipp);
        };


    });

    var meineTipps = [
        {
            id: 0,
            partieId: 1,
            tippMannschaft1: 1,
            tippMannschaft2: 2
        }
    ];


    var partien =[];

    var mannschaften =[];
})();


