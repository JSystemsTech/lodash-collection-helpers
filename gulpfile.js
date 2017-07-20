'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var flatmap = require('gulp-flatmap');
var istanbul = require('gulp-istanbul');
var util = require('gulp-util');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var path = require('path');
var eventStream = require('event-stream');
var badgeUrl = require('shields-badge-url-custom');
var _ = require('underscore');
var gulpHelpers = require('./gulp-helpers');
var documentation = require('documentation');
var SOURCE_FILE_NAME = 'lodash-collection-helpers';
var SOURCE_FILE_PATH = './src/' + SOURCE_FILE_NAME + '.js'

gulp.task('test', function() {
    return gulp.src('./src/**/*-spec.js', {
            read: false
        })
        .pipe(mocha({
            require: [path.resolve('./mocha-helper.js')]
        }));
});

gulp.task('coverage', function() {
    return gulp.src(['./src/**/*.js', '!./src/**/*-spec.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(['./src/**/*-spec.js'])
                .pipe(mocha({
                    require: [path.resolve('./mocha-helper.js')]
                }))
                .pipe(istanbul.writeReports())
        });
});

gulp.task('documentation', function() {
    documentation.lint('/src/' + SOURCE_FILE_NAME + '.js').then(lintOutput => {
        if (lintOutput) {
            console.log(lintOutput);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
});

gulp.task('minify', function() {
    return browserify({
            entries: [path.resolve(SOURCE_FILE_PATH)],
            standalone: SOURCE_FILE_NAME
        })
        .bundle()
        .pipe(source(SOURCE_FILE_PATH))
        .pipe(rename(SOURCE_FILE_NAME + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'))
        .pipe(rename('lodash-collection-helpers.min.js'))
        .pipe(uglify({
            compress: {
                dead_code: true
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['minify']);