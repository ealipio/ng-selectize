describe('Testsuite for ng-options', function() {

  'use strict';

  function compile(template) {
    return $compile(template)($scope);
  }

  var $scope, $compile;

  beforeEach(module('ngSelectize'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  it('should work with the expression: "o for o in options"', function() {
    var ready = false;

    $scope.options = ['One', 'Two'];

    var element = compile('<select ng-selectize ng-model="selected" ng-options="o for o in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe(0);
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe(1);
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

  it('should work with the expression: "o.name for o in options"', function() {
    var ready = false;

    $scope.options = [{name: 'One', value: 1}, {name: 'Two', value: 2}];

    var element = compile('<select ng-selectize ng-model="selected" ng-options="o.name for o in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe(0);
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe(1);
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

  it('should work with the expression: "o.value as o.name for o in options"', function() {
    var ready = false;

    $scope.options = [{name: 'One', value: 1}, {name: 'Two', value: 2}];

    var element = compile('<select ng-selectize ng-model="selected" ng-options="o.value as o.name for o in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe(0);
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe(1);
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

  it('should work with the expression: "o as o.name for o in options"', function() {
    var ready = false;

    $scope.options = [{name: 'One', value: 1}, {name: 'Two', value: 2}];

    var element = compile('<select ng-selectize ng-model="selected" ng-options="o as o.name for o in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe(0);
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe(1);
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

  it('should work with the expression: "value as key for (key, value) in options"', function() {
    var ready = false;

    $scope.options = {One: 1, Two: 2};

    var element = compile('<select ng-selectize ng-model="selected" ng-options="value as key for (key, value) in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe('One');
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe('Two');
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

  it('should work with the expression: "key as value for (key, value) in options"', function() {
    var ready = false;

    $scope.options = {One: 1, Two: 2};

    var element = compile('<select ng-selectize ng-model="selected" ng-options="key as value for (key, value) in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe('One');
      expect($content.children().eq(0).text()).toBe('1');
      expect($content.children().eq(1).data('value')).toBe('Two');
      expect($content.children().eq(1).text()).toBe('2');
    });
  });

  it('should work with the expression: "key for (key, value) in options"', function() {
    var ready = false;

    $scope.options = {One: 1, Two: 2};

    var element = compile('<select ng-selectize ng-model="selected" ng-options="key for (key, value) in options"></select>');
    $scope.$apply();

    runs(function() {
      setTimeout(function() {
        ready = true;
      }, 0);
    });

    waitsFor(function() {
      return ready;
    });

    runs(function() {
      var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
      expect($content.children().length).toBe(2);
      expect($content.children().eq(0).data('value')).toBe('One');
      expect($content.children().eq(0).text()).toBe('One');
      expect($content.children().eq(1).data('value')).toBe('Two');
      expect($content.children().eq(1).text()).toBe('Two');
    });
  });

});
