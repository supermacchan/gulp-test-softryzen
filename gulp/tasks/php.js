const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');

const php = () => {
  return gulp
    .src([paths.src.php, '!src/app/**', '!src/crm/**', '!src/phpmailer/**'])
    .pipe(
      plumber(
        notify.onError({
          title: 'PHP',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(gulp.dest(paths.build.php));
};

module.exports = php;
