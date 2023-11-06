const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const webpackStream = require('webpack-stream');
const paths = require('../paths');

const scripts = () => {
  return gulp
    .src(paths.src.js)
    .pipe(
      plumber(
        notify.onError({
          title: 'JS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      webpackStream({
        mode: 'production',
        output: {
          filename: 'app.min.js',
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(paths.build.js));
};

module.exports = scripts;
