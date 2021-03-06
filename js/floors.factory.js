'use strict';

angular.
module('core.elevator').
factory('Floors', function() {
    // Floors
    var floors = [];
    for (var i = 10; i > 0; i--) floors.push({
        title: i
    });
    floors.push({
        title: "G"
    });
    // Let's have them know their indices. Zero-indexed, from top to bottom.
    // Also let's initialize them.
    floors.forEach(function(floor, n) {
        floor.n = n;
        floor.open = false;
        floor.light = null;
        floor.underline = null;


        floor.openFloorDoor = function(n) {
                !floors[n].open ? floors[n].open = true : floors[n].open = false;
            },

        floor.autoShutFloorDoor = function(n) {
            floors[n].open = false; 
        }
        
        floor.autoOpenFloorDoor = function(n) {
            floors[n].open = true; 
        }        
    });

    return floors;

});