'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var _ = require('lodash');
var buildReadme = require('./gulpCustomPlugins/build-readme.js');
var SOURCE_FILE_NAME = 'lodash-collection-helpers';
var SOURCE_FILE_NAME_ES5 = SOURCE_FILE_NAME + '-es2015';
var SOURCE_FILE_PATH = './src/' + SOURCE_FILE_NAME + '.js'
var SOURCE_FILE_PATH_ES5 = './dist/' + SOURCE_FILE_NAME_ES5 + '.js'

gulp.task('buildreadme', function() {
    return gulp.src('./readme.md')
        .pipe(buildReadme())
        .pipe(gulp.dest('./'))
});

gulp.task('transpile', function() {
    return gulp.src(SOURCE_FILE_PATH)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename(SOURCE_FILE_NAME_ES5 + '.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('minify', function() {
    return gulp.src(SOURCE_FILE_PATH_ES5)
        .pipe(rename(SOURCE_FILE_NAME_ES5 + '.min.js'))
        .pipe(uglify({
            compress: {
                dead_code: true
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('package', function() {
    return gulp.src(SOURCE_FILE_PATH)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename(SOURCE_FILE_NAME_ES5 + '.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename(SOURCE_FILE_NAME_ES5 + '.min.js'))
        .pipe(uglify({
            compress: {
                dead_code: true
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['transpile']);