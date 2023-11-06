const gulp = require('gulp');
const paths = require('../paths');

const phpmailer = () => {
  return gulp.src(paths.src.phpmailer).pipe(gulp.dest(paths.build.phpmailer));
};

module.exports = phpmailer;
