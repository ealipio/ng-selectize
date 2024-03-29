describe('Tests for the ngSelectize directive', function() {
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

  describe('with a select-element', function() {

    it('should throw an error if no model (ng-model) is defined', function() {
      expect(function() {
        compile('<select ng-selectize></select>');
      }).toThrow();
    });

    it('should throw an error if the element is not a select element', function() {
      expect(function() {
        compile('<input type="text" ng-selectize ng-model="selected">');
      }).toThrow();
    });

    it('should compile without an error', function() {
      expect(function() {
        compile('<select ng-selectize ng-model="selected"></select>');
      }).not.toThrow();
    });

    it('should build the DOM structure as expected', function() {
      var element = compile('<select ng-selectize ng-model="selected"></select>');

      expect(element.next().hasClass('selectize-control')).toBe(true);
      expect(element.next().children().eq(0).hasClass('selectize-input')).toBe(true);
      expect(element.next().children().eq(1).hasClass('selectize-dropdown')).toBe(true);
    });

    describe('without ng-options', function() {

      it('should compile properly', function() {
        var element = compile('<select ng-selectize ng-model="selected">' +
          '<option value="">Null</option>' +
          '<option value="0">Zero</option>' +
          '<option value="1">One</option>' +
          '</select>');

        element[0].selectize.focus();

        var ready = false;
        $scope.$apply();

        runs(function() {
          setTimeout(function() {
            ready = true;
            var $content = element.next().find('.selectize-dropdown').find('.selectize-dropdown-content');
            expect($content.children().length).toBe(2);
          }, 10);
        });

        waitsFor(function() {
          return ready;
        });
      });

      it('should update the model', function() {
        var element = compile('<select ng-selectize ng-model="selected">' +
          '<option value="">Null</option>' +
          '<option value="0">Zero</option>' +
          '<option value="1">One</option>' +
          '</select>');

        $scope.$apply();

        element[0].selectize.setValue('0');
        expect($scope.selected).toBe('0');
      });

      it('model changes should update the select', function() {
        $scope.selected = '';
        var element = compile('<select ng-selectize ng-model="selected">' +
          '<option value="">Null</option>' +
          '<option value="0">Zero</option>' +
          '<option value="1">One</option>' +
          '</select>');

        var ready = false;

        $scope.selected = '1';
        $scope.$apply();

        runs(function() {
          setTimeout(function() {
            ready = true;
            expect(element[0].selectize.getValue()).toBe('1');
          }, 10);
        });

        waitsFor(function() {
          return ready;
        });
      });

      it('should work with a initialized filled model', function() {
        $scope.selected = '1';
        var element = compile('<select ng-selectize ng-model="selected">' +
          '<option value="0">Zero</option>' +
          '<option value="1">One</option>' +
          '</select>');

        var ready = false;

        $scope.$apply();

        runs(function() {
          setTimeout(function() {
            ready = true;
            expect(element[0].selectize.getValue()).toBe('1');
          }, 10);
        });

        waitsFor(function() {
          return ready;
        });
      });

    });

    describe('should handle "nulloption" properly', function() {

      it('should work with o for o in options', function() {
        var ready = false;

        $scope.options = ['One', 'Two'];

        var element = compile('<select ng-selectize ng-model="selected" ng-options="o for o in options"><option value="">Default</option></select>');
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
          expect($content.children().length).toBe(3);
        });
      });
    });

    describe('should work with multiple values', function() {
      it('should work with multiple values for the expression: "o.value as o.name for o in options"', function() {
        var ready = false;

        $scope.options = [{name: 'One', value: 1}, {name: 'Two', value: 2}, {name: 'Three', value: 3}];
        $scope.selected = [1, 2];

        var element = compile('<select ng-selectize ng-model="selected" ng-options="o.value as o.name for o in options" multiple></select>');
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
          var values = element[0].selectize.getValue();
          expect(values.length).toBe(2);
        });
      });
    });

    describe('Tests for user options', function() {

      describe('placeholder option', function() {

        it('should display the placeholder when no ng-options are defined', function() {
          $scope.config = {
            placeholder: 'Eat my shorts!'
          };

          var element = compile('<select ng-selectize="config" ng-model="selected">' +
            '<option value=""></option>' +
            '<option value="0">Zero</option>' +
            '<option value="1">One</option>' +
            '</select>');

          var ready = false;

          $scope.$apply();

          runs(function() {
            setTimeout(function() {
              ready = true;
              var $content = element.next().find('.selectize-input');
              expect($content.children('input').attr('placeholder')).toBe('Eat my shorts!');
            }, 10);
          });

          waitsFor(function() {
            return ready;
          });

        });

        it('should display the placeholder when ng-options are defined', function() {
          $scope.options = [{name: 'One', value: 1}, {name: 'Two', value: 2}, {name: 'Three', value: 3}];

          var element = compile('<select ng-selectize="{placeholder:\'Eat my shorts!\'}" ng-model="selected" ng-options="o.value as o.name for o in options"></select>');
          $scope.$apply();

          var $content = element.next().find('.selectize-input');
          expect($content.children('input').attr('placeholder')).toBe('Eat my shorts!');

        });

      });

      describe('custom item and option creation', function() {

        it('should work when a custom option renderer is provided', function() {
          $scope.options = [
            {label: 'Label 1', value: 'Value 1'},
            {label: 'Label 2', value: 'Value 2'}
          ];

          $scope.config = {
            render: {
              option: function(option, escape) {
                var label = option.label,
                    value = option.value;

                return '<div><span>' + escape(label) + '</span><span>' + escape(value) + '</span></div>';
              }
            }
          };

          var element = compile('<select ng-selectize="config" ng-model="selected" ng-options="o as o.label for o in options"></select>');
          $scope.$apply();

          var ready = false;
          runs(function() {
            setTimeout(function() {
              ready = true;
              var dropDownContent = element.next().find('.selectize-dropdown-content').children('div').eq(0).html();
              expect(dropDownContent).toBe('<span>Label 1</span><span>Value 1</span>');
            }, 10);
          });

          waitsFor(function() {
            return ready;
          });
        });

        it('should work when a custom option renderer is provided', function() {
          $scope.options = [
            {label: 'Label 1', value: 'Value 1'},
            {label: 'Label 2', value: 'Value 2'}
          ];

          $scope.selected = $scope.options[0];

          $scope.config = {
            render: {
              item: function(option, escape) {
                var label = option.label,
                    value = option.value;

                return '<div><span>' + escape(label) + '</span><span>' + escape(value) + '</span></div>';
              }
            }
          };

          var element = compile('<select ng-selectize="config" ng-model="selected" ng-options="o as o.label for o in options"></select>');
          $scope.$apply();

          var ready = false;
          runs(function() {
            setTimeout(function() {
              ready = true;
              var dropDownContent = element.next().find('.selectize-input').children('div').eq(0).html();
              expect(dropDownContent).toBe('<span>Label 1</span><span>Value 1</span>');
            }, 10);
          });

          waitsFor(function() {
            return ready;
          });
        });

        it('custom option renderer should work with a static select (without ng-options)', function() {
          $scope.config = {
            render: {
              option: function(option, escape) {
                var label = option.text,
                  value = option.value;

                return '<div><span>' + escape(label) + '</span><span>' + escape(value) + '</span></div>';
              }
            }
          };

          var element = compile('<select ng-selectize="config" ng-model="selected"><option value="1">Option 1</option><option value="2">Option 2</option></select>');
          $scope.$apply();

          element[0].selectize.focus();

          var ready = false;
          runs(function() {
            setTimeout(function() {
              ready = true;
              var dropDownContent = element.next().find('.selectize-dropdown-content').children('div').eq(0).html();
              expect(dropDownContent).toBe('<span>Option 1</span><span>1</span>');
            }, 10);
          });

          waitsFor(function() {
            return ready;
          });
        });

        it('custom item renderer should work with a static select (without ng-options)', function() {
          $scope.selected = 1;

          $scope.config = {
            render: {
              item: function(option, escape) {
                var label = option.text,
                  value = option.value;

                return '<div><span>' + escape(label) + '</span><span>' + escape(value) + '</span></div>';
              }
            }
          };

          var element = compile('<select ng-selectize="config" ng-model="selected"><option value="1">Option 1</option><option value="2">Option 2</option></select>');
          $scope.$apply();

          var ready = false;
          runs(function() {
            setTimeout(function() {
              ready = true;
              var dropDownContent = element.next().find('.selectize-input').children().eq(0).html();
              expect(dropDownContent).toBe('<span>Option 1</span><span>1</span>');
            }, 10);
          });

          waitsFor(function() {
            return ready;
          });
        });

      });

    });

  });

});
