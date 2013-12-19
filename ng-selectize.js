angular.module('ngSelectize', [])

.directive('ngSelectize', function() {

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
      }
    }

    var init_select = function($input, settings_element) {
      var i, n, tagName, $children, order = 0;
      var options = settings_element.options;

      var readData = function($el) {
        var data = $el.attr('data-data');
        if (typeof data === 'string' && data.length) {
          return JSON.parse(data);
        }
        return null;
      };

      var addOption = function($option, group) {
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

        if (option = parseOption($option)) {
          option.optgroup = group;
          option.$order = ++order;
          options.push(option);

          if ($option.is(':selected')) {
            settings_element.items.push(option.value);
          }
        }

      };

      var addGroup = function($optgroup) {
        var i, n, id, optgroup, $options;

        $optgroup = $($optgroup);
        id = $optgroup.attr('label');

        if (id) {
          optgroup = readData($optgroup) || {};
          optgroup['label'] = id;
          optgroup['value'] = id;
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
    };

    /**
     *
     * @param {Object} element
     *
     * @returns {{options: Array, optgroups: {}, items: Array}}
     */
    function parseSelect(element) {
      var options = {
        options: [],
        optgroups: {},
        items: []
      };

      init_select(element, options);

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

    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1000,
      link: function(scope, element, attrs, ctrl) {

        var lastParsed,
            select,
            selectize,
            timeout,
            parsed,
            render = ctrl.$render,
            userOptions = config(scope.$eval(attrs.ngSelectize));

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
            .end()
            .trigger('change');
        }

        if (angular.isDefined(attrs.ngOptions)) {
          select = element.selectize(userOptions);
          selectize = select[0].selectize;

          selectize.updateOriginalInput = angular.noop;

          ctrl.$render = renderSelect;
        }

        if (!angular.isDefined(attrs.ngOptions)) {
          parsed = parseSelect(element);

          select = element.selectize(userOptions);
          selectize = select[0].selectize;

          selectize.clearOptions();
          setOptions(selectize, parsed.options);

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
            }, 0)
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
        })
      }
    }
  }
);