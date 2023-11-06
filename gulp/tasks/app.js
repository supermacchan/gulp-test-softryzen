const gulp = require('gulp');
const paths = require('../paths');

const app = () => {
  return gulp.src(paths.src.app).pipe(gulp.dest(paths.build.app));
};

module.exports = app;
