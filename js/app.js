'use strict';

angular.module("elevator", ['core.elevator']).
controller("ElevatorCtrl", ["$scope", "$interval", 'Elevator', "Floors", function($scope, $interval, car, floors) {
  $scope.car = car;
  $scope.floors = floors;

  var floorsToGo = $scope.floorsToGo = [];
  // Object representing the control panel in the car
  $scope.panel = {
    // I would take user requests from the "press button" 
    // One request per user should be a good deal
    // Yellow underline for the floor to go and green underline when the car has arrived 
    press: function(n) {

        n > car.floor ? car.dir = 1 : car.dir = -1;
        floors[n].autoShutFloorDoor(n);


        if (floorsToGo.length < car.nbPersonsInside) {
            floorsToGo.push(n);
            floors[n].underline = "yellow";
            floors[n].light = "green";
        }

        car.open = false;

    },

    stop: function() {
        car.open = false;
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

          $scope.queue = "free";

          if (car.floorCalled.length > 0 && floorsToGo.length < 1) {
            
            car.floor > car.floorCalled[0] && !floors[car.floor].open ?  
              (car.dir = -1, car.floor-=1) : 
            car.floor < car.floorCalled[0] && !floors[car.floor].open ? 
              (car.dir = 1, car.floor+=1) : 
            car.floor == car.floorCalled[0] ? 
              (car.dir = 0, floors[car.floor].light = "", car.floorCalled.shift()) 
              : "";
          }


          car.nbPersonsInside == 0 ? car.occupied = false : car.occupied = true;


          if (car.floor == floorsToGo[0] && !car.open && !floors[car.floor].open) {
              floorsToGo.shift();
              floors[car.floor].light = ""
              floors[car.floor].autoShutFloorDoor(car.floor);
              $scope.queue = false;
              floors[car.floor].underline = "";
          }

          if (floorsToGo.length > 0) {
              floorsToGo.sort();
              floorsToGo.reverse();
              $scope.queue = true;
              !car.open && !floors[car.floor].open && car.floor > floorsToGo[0] ?  
                (car.floor-=1, car.dir = -1) : !car.open && !floors[car.floor].open && car.floor < floorsToGo[0] ? 
                (car.dir = 1, car.floor+=1) : "";
          }
          
          car.floor == floorsToGo[0] ? (car.dir = 0, car.floor+=0) : ""

      }, 1000, 0);

  }
  $scope.timer();
}]);
