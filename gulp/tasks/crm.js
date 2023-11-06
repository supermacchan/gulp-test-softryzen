const gulp = require('gulp');
const paths = require('../paths');

const crm = () => {
  return gulp.src(paths.src.crm).pipe(gulp.dest(paths.build.crm));
};

module.exports = crm;
