//console.log('angular app loaded');

var app = angular.module('demo-socket.io', []);

app.controller('demoController', function($scope) {
    $scope.pageHeader = "Demo socket io";
    $scope.timeArray = ['init value in $scope :)'];


    //var socket = io();
    var socket = io.connect('http://localhost:3000');

    socket.on('welcome', function(data) {


        $scope.$apply(function() {
            $scope.timeArray.push(data.message);
        });
        console.log(data.message)

        // Respond with a message including this clients' id sent from the server
        socket.emit('i am client', {
            data: 'data sent from the client',
            id: data.id
        });
    });


    socket.on('time', function(data) {
        $scope.$apply(function() {
            $scope.timeArray.push(new Date(data.time));
        });
        console.log(new Date(data.time));
    });


    socket.on('error', console.error.bind(console));
    socket.on('message', console.log.bind(console));


});
