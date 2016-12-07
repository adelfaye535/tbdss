'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');

gulp.task('sass', function() {
  gulp.src('./app/sass/application.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('webpack', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
     }))
      .pipe(gulp.dest('./public/js/'));
});

gulp.task('copy', function() {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('public/'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('build', ['sass', 'copy', 'webpack']);
gulp.task('default', ['build']);

