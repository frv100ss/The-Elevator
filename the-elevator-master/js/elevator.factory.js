'use strict';

angular.
module('core.elevator').
factory('Elevator', ['Floors', function(floors) {

		function Car() {
			this.name = "car";
		}
		// Object representing the car
		Car.prototype = {
			active: function(n) {
				return this.floor == n;

			},
			// we could set a Max Charge for the elevator (Let's say 6 persons max for example)
			nbPersonsInside: 0,

			state: function() {
				var r = this.occupied ? "Occpd " : "Empty ";
				switch (this.dir) {
					case -1:
						r += "↑↑↑↑";
						break;
					case 1:
						r += "↓↓↓↓";
						break;
					case 0:
						r += this.open ? "OPEN" : "STOP";
				}

				return r;
			},

			// The car can be opened if it's at the current floor
			canOpen: function(n) {
				return this.active(n) ? true : false;
			},

			callCar: function(n) {
				// It's safer to shut both inner and outer doors before the car movement
				floors[n].autoShutFloorDoor(n);
				this.shutCarDoor();

				n > this.floor ? this.dir = 1 : this.dir = -1;

				//let's store the variable here and call it later (in the $interval skeleton)
				this.floorCalled = n;

				for (var i = 10; i >= 0; i--) {
					floors[i].light = "";
					if (i == n) {
						continue;
					}
				}
				floors[n].light = "green";
			},

			stepIn: function(n) {
				this.nbPersonsInside++;
				if (this.nbPersonsInside == 6) {
					floors[n].autoShutFloorDoor(n);
					car.shutCarDoor()
				};
				this.occupied = true;
				for (var i = 10; i >= 0; i--) floors[i].light = "red";
			},

			stepOut: function(n) {
				this.nbPersonsInside--;
				if (this.nbPersonsInside == 0) {
					this.occupied = false;
					for (var i = 10; i >= 0; i--) floors[i].light = "";
					this.shutCarDoor();
					floors[n].autoShutFloorDoor(n)
				};
			},

			openCarDoor: function(n) {
				// the example mentionned that the inner door is a manual door, the outer door is a little special :
				// from the outside of the car we need to open it manually to access the car door
				// But when we are inside the car, we can open the outside (or "floor") door from inside the car

				this.open = true;
				if (this.occupied) {
					floors[n].openFloorDoor()
				};
			},

			shutCarDoor: function() {

				car.open = false;

			},

			dir: 0,
			floor: 10,
			open: false,
			occupied: false

		}

		var car = new Car();
		return car;
	}

]);