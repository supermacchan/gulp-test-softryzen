const gulp = require('gulp');
const newer = require('gulp-newer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');

const images = () => {
  return gulp
    .src(['src/assets/images/components/**/*'])
    .pipe(
      plumber(
        notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(newer(paths.build.images))
    .pipe(gulp.dest(`${paths.build.images}/components/`));
};

module.exports = images;
