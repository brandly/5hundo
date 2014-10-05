var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
ngAnnotate = require('gulp-ng-annotate'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify-css'),
path = require('path'),
express = require('express'),

build = gutil.env.gh ? './gh-pages/' : './build/';

if (!gutil.env.gh) {
  uglify = gutil.noop;
  minify = gutil.noop;
}

function onError(err) {
  gutil.log(err);
  gutil.beep();
  this.emit('end');
}

gulp.task('coffee', function () {
  return gulp.src('src/**/*.coffee')
    .pipe(coffee())
    .on('error', onError)
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(build));
});

gulp.task('libraries', function () {
  return gulp.src([
      'bower_components/angular/angular.js',
      'bower_components/angular-youtube-mb/src/angular-youtube-embed.js'
    ])
    .pipe(uglify())
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(build));
});

gulp.task('sass', function () {
  return gulp.src('src/styles/style.scss')
    .pipe(sass())
    .on('error', onError)
    .pipe(minify())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(build));
});

gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(build));
});

gulp.task('images', function () {
  return gulp.src('src/images/*')
    .pipe(gulp.dest(build));
});

gulp.task('cname', function () {
  return gulp.src('CNAME')
    .pipe(gulp.dest(build));
});

gulp.task('build', [
  'index',
  'coffee',
  'libraries',
  'sass',
  'images',
  'cname'
]);

gulp.task('default', ['build'], function () {
  if (!gutil.env.gh) {
    gulp.watch(['src/**', 'bower_components/**'], ['build']);

    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve(build)));
    app.listen(port, function() {
      gutil.log('Listening on', port);
    });
  }
});
