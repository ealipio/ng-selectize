module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: grunt.file.readJSON('bower.json'),
    jshint: {
      options: {
        jshintrc: true
      },
      files: [
        'ng-selectize.js'
      ]
    },
    watch: {
      scripts: {
        files: [
          'ng-selectize.js',
          'Gruntfile.js',
          'test/*.js'
        ],
        tasks: ['build']
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= bower.name %> - v<%= bower.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> | ' +
          '<%= pkg.repository.url %> | ' +
          '<%= pkg.license %> License */\n'
      },
      default: {
        files: {
          'dist/ng-selectize.min.js': ['ng-selectize.js']
        }
      }
    },
    concat: {
      standalone: {
        src: [
          'lib/selectize/dist/js/standalone/selectize.min.js',
          'dist/ng-selectize.min.js'
        ],
        dest: 'dist/standalone/ng-selectize.min.js'
      }
    },
    karma: {
      test: {
        configFile: 'test/karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', ['jshint', 'uglify', 'concat', 'karma']);
};
