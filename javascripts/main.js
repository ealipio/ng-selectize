angular.module('ngSelectizeDemo', ['ngSelectize'])

.controller('DemoCtrl', function($scope) {

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    $scope.selectedOption = $scope.selectedOption2 = undefined;

    $scope.options = [
      {label: 'Option 1', value: 1},
      {label: 'Option 2', value: 2},
      {label: 'Option 3', value: 3},
      {label: 'Option 4', value: 4},
      {label: 'Option 5', value: 5}
    ];

    $scope.selectRandomOption = function() {
      $scope.selectedOption = $scope.options[getRandomInt(0, $scope.options.length - 1)];
    };

    $scope.selectRandomOption2 = function() {
      $scope.selectedOption2 = getRandomInt(1, 5);
    };
});
