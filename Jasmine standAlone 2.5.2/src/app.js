angular.module("elevator", ['core.elevator']).
controller("ElevatorCtrl", ["$scope", "$interval", 'Elevator', "Floors", function($scope, $interval, car, floors) {
    $scope.car = car;
    $scope.floors = floors;
    // $scope.floorCalled = car.floorCalled; 

    var toDeserve = $scope.floorToDeserve = [];

    // Object representing the control panel in the car
    $scope.panel = {

        // I would take user requests from the "press button" 
        // One request per user should be a good deal
        // Yellow underline for the floor to go and green underline when the car has arrived 
        press: function(n) {

            n > car.floor ? car.dir = 1 : car.dir = -1;
            floors[n].autoShutFloorDoor(n);


            if (toDeserve.length < car.nbPersonsInside) {
                toDeserve.push(n);
                floors[n].underline = "yellow";
            }

            car.open = false;


        },

        stop: function() {
            $scope.stopTimer();
            alert("You had pressed the STOP Button, for security reasons, the elevator is not available anymore. A technician will come in less than 15 minutes")

        }
    }

    $scope.stopTimer = function() {
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
        }
    }

    var timer;
    $scope.timer = function() {
        timer = $interval(function() {

            var deserveStatement;
            $scope.queue = "free";

            if (angular.isDefined(car.floorCalled) && toDeserve.length < 1) {
                car.floor = car.floorCalled;

            }
            car.dir = 0;

            car.nbPersonsInside == 0 ? car.occupied = false : car.occupied = true;



            car.floor == toDeserve[0] ? deserveStatement = true : deserveStatement = false;
            if (deserveStatement && !car.open) {
                toDeserve.shift();
                floors[car.floor].autoShutFloorDoor(car.floor);
                $scope.queue = false;
                floors[car.floor].underline = "";
            }

            if (toDeserve.length > 0) {
                toDeserve.sort();
                toDeserve.reverse();
                $scope.queue = true;
                car.floor = toDeserve[0];
            }


            toDeserve[0] > car.floor ? car.dir = 1 : toDeserve.length == 0 ? car.dir = 0 : car.dir = -1;

            if (toDeserve.length == 0 && !angular.isDefined(car.floorCalled)) {

                car.floor = 10;

            }
        }, 3000, 0);

    }
    $scope.timer();
}]);