angular.module('ngSelectize', [])

.directive('ngSelectize', ['$parse', function($parse) {
    'use strict';

    var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

    /**
     *
     * @param {Object} userConf
     *
     * @returns {Object}
     */
    function config(userConf) {
      return angular.extend({sortField: '$order'}, userConf || {});
    }

    /**
     *
     * @param {Object} $option
     *
     * @returns {{text: (string), value: (string)}}
     */
    function parseOption($option) {
      var value = $option.val(),
          label = $option.text();

      if (!value && !label) {
        return;
      }

      if (value === '?' && !label) {
        return;
      }

      if (!value && label) {
        value = '?';
      }

      return {
        text: label || '',
        value: value || ''
      };
    }

    function readData($element) {
      var data = $element.attr('data-data');
      if (typeof data === 'string' && data.length) {
        return JSON.parse(data);
      }
      return null;
    }

    function init_select($input, settings_element) {
      var i, n, tagName, $children, order = 0,
          options = settings_element.options,

      addOption = function($option, group) {
        var option;

        $option = $($option);

        // if the option already exists, it's probably been
        // duplicated in another optgroup. in this case, push
        // the current group to the "optgroup" property on the
        // existing option so that it's rendered in both places.
        /*
         if (options.hasOwnProperty(value)) {
         if (group) {
         if (!options[value].optgroup) {
         options[value].optgroup = group;
         } else if (!$.isArray(options[value].optgroup)) {
         options[value].optgroup = [options[value].optgroup, group];
         } else {
         options[value].optgroup.push(group);
         }
         }
         return;
         }
         */

        option = parseOption($option);

        if (option) {
          option.optgroup = group;
          option.$order = ++order;
          options.push(option);

          if ($option.is(':selected')) {
            settings_element.items.push(option.value);
          }
        }

      },

      addGroup = function($optgroup) {
        var i, n, id, optgroup, $options;

        $optgroup = $($optgroup);
        id = $optgroup.attr('label');

        if (id) {
          optgroup = readData($optgroup) || {};
          optgroup.label = id;
          optgroup.value = id;
          settings_element.optgroups[id] = optgroup;
        }

        $options = $('option', $optgroup);
        for (i = 0, n = $options.length; i < n; i++) {
          addOption($options[i], id);
        }
      };

      settings_element.maxItems = $input.attr('multiple') ? null : 1;

      $children = $input.children();
      for (i = 0, n = $children.length; i < n; i++) {
        tagName = $children[i].tagName.toLowerCase();
        if (tagName === 'optgroup') {
          addGroup($children[i]);
        } else if (tagName === 'option') {
          addOption($children[i]);
        }
      }
    }

    /**
     *
     * @param {Object} $element
     *
     * @returns {{options: Array, optgroups: {}, items: Array}}
     */
    function parseSelect($element) {
      var options = {
        options: [],
        optgroups: {},
        items: []
      };

      init_select($element, options);

      return options;
    }

    /**
     *
     * @param {Object} selectize
     * @param {Array}  options
     */
    function setOptions(selectize, options) {
      if (!options.length) {
        return;
      }

      selectize.addOption(options);
      selectize.refreshOptions(false);
    }

    /**
     *
     * @param {Object} selectize
     * @param {*}      value
     */
    function setActiveOption(selectize, value) {
      if (Array.isArray(value)) {
        value.forEach(function(val) {
          setActiveOption(selectize, val);
        });
        return;
      }

      var option = selectize.getOption(value);

      selectize.addItem(value);
      selectize.setActiveOption(option, false);
    }

    function checkElement(element) {
      var type = element.nodeName.toLowerCase();

      if (type !== 'select') {
        throw new Error('Invalid element given.');
      }
    }

    function getValueFn(valuesFn, data) {
      return function(value) {
        return valuesFn(data)[value];
      };
    }

    function decorateRenderer(config) {
      if (!config.provider || !config.provider[config.method]) {
        return;
      }

      var renderFn = config.provider[config.method];

      config.provider[config.method] = function(item, escapeFn) {
        return renderFn.call(
          this,
          config.valueFn(item.value),
          escapeFn
        );
      };
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1000,
      scope: {
        ngSelectize: '='
      },
      link: function(scope, element, attrs, ctrl) {

        var lastParsed,
            select,
            selectize,
            timeout,
            parsed,
            valuesFn,
            valueFn,
            render = ctrl.$render,
            userOptions = config(scope.ngSelectize),
            match = (attrs.ngOptions || '').match(NG_OPTIONS_REGEXP);

        function updateOriginalInput() {
          var value = this.getValue();

          if (!Array.isArray(value)) {
            value = [value];
          }

          element
            .children('option')
              .prop('selected', false)
              .filter(function() {
                return value.indexOf(this.value) > -1;
              })
              .prop('selected', true)
              .end().end()
            .trigger('change');
        }

        if (angular.isDefined(attrs.ngOptions)) {
          valuesFn = $parse(match[7]);
          valueFn = getValueFn(valuesFn, scope.$parent);

          ['option', 'item'].forEach(function(method) {
            decorateRenderer({
              provider: userOptions.render,
              method: method,
              valueFn: valueFn
            });
          });

          select = element.selectize(userOptions);
          selectize = select[0].selectize;

          selectize.updateOriginalInput = angular.noop;

          ctrl.$render = renderSelect;
        }

        if (!angular.isDefined(attrs.ngOptions)) {
          checkElement(element[0]);

          select = element.selectize(userOptions);
          selectize = select[0].selectize;

          element.on('change', function() {
            if (selectize.getValue() === '?') {
              ctrl.$setViewValue(null);
              scope.$apply();
            }
          });

          ctrl.$render = function() {
            clearTimeout(timeout);

            timeout = setTimeout(function() {
              setActiveOption(selectize, ctrl.$modelValue);
            }, 0);
          };
        }

        selectize.on('item_add', updateOriginalInput);
        selectize.on('item_remove', updateOriginalInput);

        function renderSelect() {
          render();

          clearTimeout(timeout);

          timeout = setTimeout(function() {
            parsed = parseSelect(element);

            if (lastParsed) {
              if (angular.equals(lastParsed, parsed)) {
                return;
              }
            }

            lastParsed = parsed;

            selectize.clearOptions();
            angular.forEach(parsed.optgroups, function(value, key) {
              selectize.addOptionGroup(key, value);
            });
            setOptions(selectize, parsed.options);
            setActiveOption(selectize, parsed.items);
          }, 0);
        }

        scope.$watch(ctrl.$render);

        scope.$on('$destroy', function() {
          selectize.destroy();
          clearTimeout(timeout);
        });
      }
    };
  }
]);