'use strict';
let gulp = require('gulp');
let ts = require('gulp-typescript');
let beautify = require('gulp-jsbeautify');
let sourcemaps = require('gulp-sourcemaps');
let runSequence = require('run-sequence');
let clean = require('gulp-clean');
let options = require('./tsconfig.json');
let tsProject = ts.createProject('tsconfig.json');

gulp.task('build-dev', () => {
  let result = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject()));

  return result.js
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      mapSources: (sourcePath) => {
        return '../../' + sourcePath;
      }
    }))
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('bin'));
});

gulp.task('build-prod', () => {
  return gulp.src(['./src/**/*.ts', 'typings/**/*.d.ts'])
    .pipe(ts(
      options.compilerOptions
    ))
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('release'));
});

gulp.task('build-tests', () => {
  let result = tsProject.src()
    .pipe(ts(tsProject(), ts.reporter.nullReporter()));

  return result.js
    .pipe(gulp.dest('./'));
});

gulp.task('clean', () => {
  runSequence('clean-tests', 'clean-source');
})

gulp.task('clean-tests', () => {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('clean-source', () => {
  return gulp.src('./src/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('clean-release', () => {
  return gulp.src('./release/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('release', () => {
  runSequence('clean-release', 'build-prod');
});

gulp.task('watch', ['build-dev'], () => {
  gulp.watch('./src/**/*.ts', () => gulp.start('build-dev'));
});
