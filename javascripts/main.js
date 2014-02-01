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

    $scope.config = {
      render: {
        option: function(item, escapeFn) {
          return '<div><span>Label: ' + item.label + '</span><br><small>Value: ' + item.value + '</small></div>'
        }
      }
    };

    $scope.config2 = {
      render: {
        item: function(item, escapeFn) {
          return '<div><span>' + item.label + '</span>&nbsp;<small>(' + item.value + ')</small></div>'
        }
      }
    };
});
