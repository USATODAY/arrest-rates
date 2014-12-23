module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'style/scss/project.css': 'style/scss/project.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        // Task-specific options go here.
      },
      single_file: {
        options: {
          map: true
        },
        src: 'style/scss/project.css',
        dest: 'www/style/project.css'
      }
    },
    jshint: {
      options: {
        ignores: ['bundle.js']
      },
      all: ['Gruntfile.js','test/*.js', 'js/app.js']
    },
    uglify: {
      my_target: {
        options: {
          mangle: false,
          sourceMap: true
        },
        files: {
          'www/js/app.min.js': ['js/app.js'],
          'www/js/templates.min.js': ['js/templates.js']
        }
      }
    },
    watch: {
      styles: {
        files: ['style/scss/*.scss'],
        tasks: ['sass', 'autoprefixer']
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint', 'uglify']
      },
      test: {
        files: ['tests/spec/*.js'],
        tasks: ['copy']
      },
      html: {
        files: ['*.html'],
        tasks: ['copy']
      },
      templ: {
        files: ['templates/*.html'],
        tasks: ['jst', 'copy']
      },
      options: {
        livereload: true,
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        base: 'www',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
        }
      }
    },
    imagemin: {                          // Task
      static: {                          // Target
        options: {                       // Target options
          optimizationLevel: 3,
        },
        files: {                         // Dictionary of files
          'img/*.png': 'src/*.png', // 'destination': 'source'
          'img/*.jpg': 'src/*.jpg',
          'img/*.gif': 'src/*.gif'
        }
      }
    },
    jasmine: {
      test: {
        src: 'src/**/*.js',
        options: {
          specs: 'test/*.js',
          helpers: 'test/*Helper.js'
        }
      }
    },

    browserify: {
      options: {
        debug: true
      },
      main: {
        src: 'js/app.js',
        dest: 'js/bundle.js'
      },
      templ: {
        src: 'js/templates.js',
        dest: 'js/template-bundle.js',
        options: {
          transform: 'jstify'
        }
      }
     
    },

    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['*.html'], dest: 'www/', filter: 'isFile'},
          {expand: true, src: ['js/*.js', 'js/**/*.json'], dest: 'www/', filter: 'isFile'},
          {expand: true, src: ['img/*'], dest: 'www/', filter: 'isFile'},
          {expand: true, src: ['tests/*.html', 'tests/**/*.js', 'tests/**/*.css'], dest: 'www/', filter: 'isFile'},
        ]
      }
    },

    clean: ["www/"],

    jst: {
      compile: {
        options: {
          namespace: "app.templates",
          processName: function(filepath) {
            var result = filepath.substr(10, filepath.length - 4);
            return result.toUpperCase();
          }
        },
        files: {
          "js/templates.js": ["templates/*.html"]
        }
      }
    },
    browserSync: {
      bsFiles: {
        src : 'www/**/*'
      },
      options: {
        watchTask: true,
        server: {
          baseDir: "www/"
        }
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-browserify');
 
  // Default task(s).

  grunt.registerTask('default', ['clean', 'sass', 'autoprefixer', 'jst', 'jshint', 'uglify', 'copy', 'browserSync', 'watch']);
  grunt.registerTask('test', ['jasmine']);


};
