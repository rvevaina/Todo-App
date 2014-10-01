
// ------------------------------------
// Settings
// ------------------------------------

var fs        = require('fs');
var gulp      = require('gulp');
var plugins   = require('gulp-load-plugins')();

var paths     = {
  styles      : './src/assets/styles/**/*.sass',
  scripts     : './src/assets/scripts/**/*.js',
  images      : './src/assets/images/**/*.{png,gif,jpeg,jpg,svg}',
  templates   : './src/**/*.jade'
};

// ------------------------------------
// Default Task
// ------------------------------------

gulp.task('default', ['images', 'scripts', 'styles', 'templates', 'watch']);

// ------------------------------------
// Watch Task
// ------------------------------------

gulp.task('watch', function() {

  plugins.livereload.listen()
  
  gulp.watch(['./public/**']).on('change', plugins.livereload.changed);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.templates, ['templates']);

});

// ------------------------------------
// Styles Task
// ------------------------------------

gulp.task('styles', function() {

     gulp.src('./src/assets/styles/index.sass')
    .pipe(plugins.sass())
    .pipe(plugins.rename('main.css'))
    .pipe(gulp.dest('./public/assets/styles/'))
    .pipe(plugins.livereload({ auto: true }));

});

// ------------------------------------
// Images Task
// ------------------------------------

gulp.task('images', function() {

  gulp.src(paths.images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('./public/assets/images/'))
    .pipe(plugins.livereload({ auto: true }));

});

// ------------------------------------
// Templates Task
// ------------------------------------

gulp.task('templates', function() {

  gulp.src(paths.templates)
    .pipe(plugins.jade({ pretty: true }))
    .pipe(gulp.dest('./public/'))
    .pipe(plugins.livereload({ auto: true }));

});

// ------------------------------------
// Scripts Task
// ------------------------------------

gulp.task('scripts', function() {

  // Find and add all libraries, in order
  var _                 = require('underscore');
  var bowerFile         = require('./bower.json');
  var exclude           = [];
  var bowerPackages     = bowerFile.dependencies;
  var bowerDirectory    = './bower_components';
  var packagesOrder     = [];
  var mainFiles         = [];

  var addPackage = function(name) {
    var dependencies, info;
    info = require(bowerDirectory + '/' + name + '/.bower.json');
    dependencies = info.dependencies;
    if (!!dependencies) {
      _.each(dependencies, function(value, key) {
        if (exclude.indexOf(key) === -1) {
          return addPackage(key);
        }
      });
    }
    if (packagesOrder.indexOf(name) === -1) {
      return packagesOrder.push(name);
    }
  };

  _.each(bowerPackages, function(value, key) {
    if (exclude.indexOf(key) === -1) {
      return addPackage(key);
    }
  });

  _.each(packagesOrder, function(bowerPackage) {
    var info, main, mainFile;
    info = require("" + bowerDirectory + "/" + bowerPackage + "/.bower.json");
    main = info.main;
    mainFile = main;
    if (_.isArray(main)) {
      _.each(main, function(file) {
        if (file.indexOf('.js') !== -1) {
          return mainFile = file;
        }
      });
    }
    mainFile = "" + bowerDirectory + "/" + bowerPackage + "/" + mainFile;
    if (mainFile.indexOf('.js') !== -1) {
      return mainFiles.push(mainFile);
    }
  });

  // Create libs.js JavaScript file
  gulp.src(mainFiles)
    .pipe(plugins.concat('libs.js'))
    .pipe(gulp.dest('./public/assets/scripts/'))
    .pipe(plugins.livereload({ auto: true }));

  // Create main.js JavaScript file
  gulp.src(paths.scripts)
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest('./public/assets/scripts/'))
    .pipe(plugins.livereload({ auto: true }));

});
